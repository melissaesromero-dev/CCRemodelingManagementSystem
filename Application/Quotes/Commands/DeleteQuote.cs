using Application.Core;
using MediatR;
using Persistence;

namespace Application.Customers.Commands
{
    public class DeleteQuote
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string Id { get; set; }
        }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var quote = await context.Quotes
                    .FindAsync([request.Id], cancellationToken);

                if (quote == null) return Result<Unit>.Failure("Quote not found", 404);

                context.Remove(quote);

                var result = await context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to delete quote", 400);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
