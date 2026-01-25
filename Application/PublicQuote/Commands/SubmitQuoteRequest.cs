using Application.Core;
using Application.Customers.CustomerDTOs;
using Application.PublicQuote.PublicQuoteDTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.PublicQuote.Commands
{
    public class SubmitQuoteRequest
    {
        public class Command : IRequest<Result<string>>
        {
            public required SubmitQuoteRequestDto RequestQuoteDto { get; set; }
        }

        public class Handler(CCRemodelDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var dto = request.RequestQuoteDto;

                const string successMessage =
                    "Thank you! Your request has been submitted. You will be contacted by one of our agents within 2 business days.";

                // Validate
                if (string.IsNullOrWhiteSpace(dto.Email))
                    return Result<string>.Failure("Email is rquired", 400);

                var emailNormalized = dto.Email.Trim().ToLowerInvariant();

                await using var tx = await context.Database.BeginTransactionAsync(cancellationToken);

                try
                {
                    // Find customer by normalized email
                    var existingCustomer = await context.Customers
                        .AsNoTracking()
                        .FirstOrDefaultAsync(c => c.EmailNormalized == emailNormalized, cancellationToken);

                    string customerId;
                    bool customerIsSampleData;

                    if (existingCustomer is not null)
                    {
                        customerId = existingCustomer.Id;
                        customerIsSampleData = existingCustomer.IsSampleData;
                    }
                    else
                    {
                        // Create customer via mapper
                        var newCustomer = mapper.Map<Customer>(dto);
                        newCustomer.CreationDate = DateTime.UtcNow;
                        newCustomer.StatusId = CustomerStatus.Active;
                        newCustomer.IsSampleData = false;

                        // Generate next CustNum
                        var maxCustNum = await context.Customers
                            .AsNoTracking()
                            .Where(c => !c.IsSampleData)
                            .MaxAsync(c => (int?)c.CustNum, cancellationToken);

                        newCustomer.CustNum = (maxCustNum ?? 999) + 1;

                        context.Customers.Add(newCustomer);

                        try
                        {
                            await context.SaveChangesAsync(cancellationToken);
                            customerId = newCustomer.Id;
                            customerIsSampleData = newCustomer.IsSampleData;
                        }
                        catch (DbUpdateException ex) when (IsUniqueEmailViolationSqlite(ex))
                        {
                            // Race condition: created after lookup
                            var customer = await context.Customers
                                .AsNoTracking()
                                .FirstOrDefaultAsync(c => c.EmailNormalized == emailNormalized, cancellationToken);

                            if (customer is null)
                                return Result<string>.Failure("A customer with this email already exists.", 400);

                            customerId = customer.Id;
                            customerIsSampleData = customer.IsSampleData;
                        }
                    }

                    // Create service request via mapper
                    var serviceReq = mapper.Map<ServiceRequest>(dto);

                    // required fields not in dto
                    serviceReq.CustomerId = customerId;
                    serviceReq.UserId = null;
                    serviceReq.SubServiceTypeId = 15;//other
                    serviceReq.StatusId = 1;

                    serviceReq.IsSampleData = customerIsSampleData;

                    // Assign next ReqNum with a small optimistic retry in case of rare race (unique index)
                    var max = await context.ServiceRequests
                        .AsNoTracking()
                        .Where(sr => sr.IsSampleData == customerIsSampleData)
                        .MaxAsync(sr => (int?)sr.ReqNum, cancellationToken);

                    serviceReq.ReqNum = (max ?? 1999) + 1;
                    serviceReq.CreationDate = DateTime.UtcNow;

                    context.ServiceRequests.Add(serviceReq);

                    await context.SaveChangesAsync(cancellationToken);
                    await tx.CommitAsync(cancellationToken);

                    return Result<string>.Success(successMessage);
                }
                catch (DbUpdateException ex)
                {
                    await tx.RollbackAsync(cancellationToken);

                    // SQLite details live here
                    var details = ex.InnerException?.Message ?? ex.Message;

                    return Result<string>.Failure(details, 400);
                }
                catch (Exception ex)
                {
                    await tx.RollbackAsync(cancellationToken);
                    return Result<string>.Failure(ex.Message, 400);
                }
            }

            private static bool IsUniqueEmailViolationSqlite(DbUpdateException ex)
            {
                // SQLite constraint violation => SqliteErrorCode 19
                if (ex.InnerException is SqliteException sqliteEx)
                {
                    return sqliteEx.SqliteErrorCode == 19 &&
                           (sqliteEx.Message.Contains("EmailNormalized", StringComparison.OrdinalIgnoreCase) ||
                            sqliteEx.Message.Contains("IX_Customers_EmailNormalized", StringComparison.OrdinalIgnoreCase));
                }

                return false;
            }
        }
    }
}
