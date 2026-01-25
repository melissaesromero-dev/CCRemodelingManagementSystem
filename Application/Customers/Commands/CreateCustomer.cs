using Application.Core;
using Application.Customers.CustomerDTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Customers.Commands
{
    public class CreateCustomer
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateCustomerDto CustomerDto { get; set; }
        }

        public class Handler(CCRemodelDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var customer = mapper.Map<Customer>(request.CustomerDto);

                // Assign next CustNum with a small optimistic retry in case of rare race (unique index)
                const int maxRetries = 3;
                for (var attempt = 1; attempt <= maxRetries; attempt++)
                {
                    // NULL-safe max
                    var max = await context.Customers
                        .AsNoTracking()
                        .Where(c => !c.IsSampleData)
                        .MaxAsync(c => (int?)c.CustNum);

                    customer.CustNum = (max ?? 999) + 1;
                    customer.CreationDate = DateTime.Today.Date;
                    
                }

                var realCount = await context.Customers.CountAsync(c => !c.IsSampleData);
                Console.WriteLine($"REAL COUNT: {realCount}");


                context.Customers.Add(customer);

                var result = await context.SaveChangesAsync() > 0;

                if (!result) return Result<string>.Failure("Failed to create the customer", 400);

                return Result<string>.Success(customer.Id);
            }
        }
    }
}
