using Application.Core;
using Application.EstimateAppointments.EstimateApptDTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.EstimateAppointments.Commands
{
    public class EditEstimateAppt
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required EditEstimateApptDto EstimateApptDto { get; set; }
        }

        public class Handler(CCRemodelDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var estimateAppt = await context.EstimateAppointments
                    .FindAsync([request.EstimateApptDto.Id], cancellationToken);

                if (estimateAppt == null) return Result<Unit>.Failure("Estimate appointment not found", 404);

                mapper.Map(request.EstimateApptDto, estimateAppt);

                var hadMods = context.Entry(estimateAppt).State == EntityState.Modified;

                var wrote = await context.SaveChangesAsync(cancellationToken);
                if (hadMods && wrote == 0)
                    return Result<Unit>.Failure("Failed to update the estimate appointment", 400);

                return Result<Unit>.Success(Unit.Value);
            }
        }

    }
}
