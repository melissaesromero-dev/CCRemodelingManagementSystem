using Application.Core;
using Application.Customers.CustomerDTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Customers.Commands
{
    public class EditCustomer
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required EditCustomerDto CustomerDto { get; set; }
        }

        public class Handler(CCRemodelDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var customer = await context.Customers
                    .FindAsync([request.CustomerDto.Id], cancellationToken);

                if (customer == null) return Result<Unit>.Failure("Customer not found", 404);

                mapper.Map(request.CustomerDto, customer);

                var hadMods = context.Entry(customer).State == EntityState.Modified;

                var wrote = await context.SaveChangesAsync(cancellationToken);
                if (hadMods && wrote == 0)
                    return Result<Unit>.Failure("Failed to update the customer", 400);

                return Result<Unit>.Success(Unit.Value);

            }
        }
    }
}
