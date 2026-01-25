using Application.Core;
using Application.ServiceRequests.ServiceReqDTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.ServiceRequests.Commands
{
    public class EditServiceRequest
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required EditServiceReqDto ServiceReqDto { get; set; }
        }

        public class Handler(CCRemodelDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var serviceRequest = await context.ServiceRequests
                    .FindAsync([request.ServiceReqDto.Id], cancellationToken);

                if (serviceRequest == null) return Result<Unit>.Failure("Service request not found", 404);

                mapper.Map(request.ServiceReqDto, serviceRequest);

                var hadMods = context.Entry(serviceRequest).State == EntityState.Modified;

                var wrote = await context.SaveChangesAsync(cancellationToken);
                if (hadMods && wrote == 0)
                    return Result<Unit>.Failure("Failed to update the service request", 400);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }

}
