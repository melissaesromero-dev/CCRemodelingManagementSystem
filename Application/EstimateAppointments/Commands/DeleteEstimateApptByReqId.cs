using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.EstimateAppointments.Commands
{
    public class DeleteEstimateApptByReqId
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string ReqId { get; set; }
        }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var estimateAppt = await context.EstimateAppointments
                    .FirstOrDefaultAsync(ea => ea.ServiceRequestId == request.ReqId, cancellationToken);

                if (estimateAppt == null) return Result<Unit>.Failure("Estimate appointment not found", 404);

                context.Remove(estimateAppt);

                var result = await context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to delete the estimate appointment", 400);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
