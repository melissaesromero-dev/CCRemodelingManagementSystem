using Application.Core;
using MediatR;
using Persistence;

namespace Application.ServiceRequests.Commands
{
    public class DeleteServiceRequest
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string Id { get; set; }
        }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var serviceRequest = await context.ServiceRequests
                    .FindAsync([request.Id], cancellationToken);

                if (serviceRequest == null) return Result<Unit>.Failure("Service request not found", 404);

                context.Remove(serviceRequest);

                var result = await context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to delete service request", 400);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
