using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class CCRemodelDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<EstimateAppointment> EstimateAppointments => Set<EstimateAppointment>();
    public DbSet<EstimateApptStatus> EstimateApptStatuses => Set<EstimateApptStatus>();
    public DbSet<Quote> Quotes => Set<Quote>();
    public DbSet<QuoteStatus> QuoteStatuses => Set<QuoteStatus>();
    public DbSet<ServiceMainType> ServiceMainTypes => Set<ServiceMainType>();
    public DbSet<ServiceRequest> ServiceRequests => Set<ServiceRequest>();
    public DbSet<ServiceRequestStatus> ServiceRequestStatuses => Set<ServiceRequestStatus>();
    public DbSet<ServiceSubType> ServiceSubTypes => Set<ServiceSubType>();
    public DbSet<State> States => Set<State>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserType> UserTypes => Set<UserType>();
    public DbSet<BudgetRange> BudgetRanges => Set<BudgetRange>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Automatically load ALL IEntityTypeConfiguration<T> classes
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CCRemodelDbContext).Assembly);
    }

}
