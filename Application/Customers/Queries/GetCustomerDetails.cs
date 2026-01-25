using Application.Core;
using Domain;
using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Customers.Queries
{
    public class GetCustomerDetails
    {
        public class Query : IRequest<Result<Customer>>
        {
            public required string Id {  get; set; }

        }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Query, Result<Customer>>
        {
            public async Task<Result<Customer>> Handle(Query request, CancellationToken cancellationToken)
            {
                var customer = await context.Customers.FindAsync([request.Id], cancellationToken);

                if (customer == null) return Result<Customer>.Failure("Activity not found", 404);
                
                return Result<Customer>.Success(customer);
            }
        }
    }
}
