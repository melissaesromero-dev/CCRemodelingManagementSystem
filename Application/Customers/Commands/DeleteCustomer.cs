using Application.Core;
using MediatR;
using Persistence;

namespace Application.Customers.Commands
{
    public class DeleteCustomer
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string Id { get; set; }
        }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var customer = await context.Customers
                    .FindAsync([request.Id], cancellationToken);

                if (customer == null) return Result<Unit>.Failure("Customer not found", 404);

                context.Remove(customer);

                var result = await context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to delete the customer", 400);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
