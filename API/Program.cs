using Application.Core;
using Application.Customers.Queries;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Persistence;
using FluentValidation;
using Application.Customers.Validators;
using Application.EstimateAppointments.Validators;
using Application.Quotes.Validators;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Http;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddDbContext<CCRemodelDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var adminOrigins = builder.Configuration.GetSection("Cors:AdminOrigins").Get<string[]>() ?? Array.Empty<string>();
var publicOrigins = builder.Configuration.GetSection("Cors:PublicOrigins").Get<string[]>() ?? Array.Empty<string>();


builder.Services.AddCors(options =>
{
    // Default = Admin app (cookies)
    options.AddDefaultPolicy(policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy
            .WithOrigins("http://localhost:3000", "https://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        }
        else
        {
            policy.WithOrigins(adminOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        }
    });

    // Public web (no cookies)
    options.AddPolicy("PublicWeb", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy
            .WithOrigins("http://localhost:3001", "https://localhost:3001")
            .AllowAnyHeader()
            .AllowAnyMethod();
        }
        else
        {
            policy.WithOrigins(publicOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
        }
    });
});

builder.Services.AddMediatR(x => {
    x.RegisterServicesFromAssemblyContaining<GetCustomersList.Handler>();
    x.AddOpenBehavior(typeof(ValidationBehavior<,>));
});
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
builder.Services.AddValidatorsFromAssemblyContaining<CreateCustomerValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateServiceReqValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateEstimateApptValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateQuoteValidator>();

builder.Services.AddTransient<ExceptionMiddleware>();


builder.Services
    .AddIdentityApiEndpoints<User>(options =>
    {
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<CCRemodelDbContext>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.ConfigureExternalCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

var app = builder.Build();

// Configure the HTTPS request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseRouting();

// Apply PublicWeb CORS ONLY for /api/public/*
app.UseWhen(
    context => context.Request.Path.StartsWithSegments("/api/public"),
    appBuilder => appBuilder.UseCors("PublicWeb")
);

// Apply default CORS for everything else (admin)
app.UseWhen(
    context => !context.Request.Path.StartsWithSegments("/api/public"),
    appBuilder => appBuilder.UseCors()
);

app.UseAuthentication();
app.UseAuthorization();

//var publicApi = app.MapGroup("public")
//    .RequireCors("PublicWeb")
//    .AllowAnonymous();

//var api = app.MapGroup("api")
//    .RequireCors("AdminApp");

app.MapControllers();
app.MapGroup("/api").MapIdentityApi<User>();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<CCRemodelDbContext>();
    var userManager = services.GetRequiredService<UserManager<User>>();

    await context.Database.MigrateAsync();

    await DbInit.AddRequiredDataAsync(context);//populate required data for lookup (e.g. states)
    await IdentitySeeder.SeedUsersAsync(userManager, context);//pupulate users

    if (app.Environment.IsDevelopment())
    {
        await SampleDataSeeder.SeedDataAsync(context);// add demo/sample data (e.g. customers)

    }
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration.");
}

app.Run();
