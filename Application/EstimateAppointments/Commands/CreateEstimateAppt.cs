using Application.Core;
using Application.EstimateAppointments.EstimateApptDTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.EstimateAppointments.Commands
{
    public class CreateEstimateAppt
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateEstimateApptDto EstimateApptDto { get; set; }
        }

        public class Handler(CCRemodelDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var estimateAppt = mapper.Map<EstimateAppointment>(request.EstimateApptDto);

                var serviceRequest = await context.ServiceRequests
                    .AsNoTracking()
                    .FirstOrDefaultAsync(
                        sr => sr.Id == estimateAppt.ServiceRequestId,
                        cancellationToken
                    );


                if (serviceRequest == null)
                    return Result<string>.Failure("Service request not found", 404);

                estimateAppt.IsSampleData = serviceRequest.IsSampleData;

                // Assign next EstApptNum with a small optimistic retry in case of rare race (unique index)
                const int maxRetries = 3;
                for (var attempt = 1; attempt <= maxRetries; attempt++)
                {
                    // NULL-safe max
                    var max = await context.EstimateAppointments
                        .AsNoTracking()
                        .Where(ea => ea.IsSampleData == estimateAppt.IsSampleData)
                        .MaxAsync(ea => (int?)ea.EstApptNum);

                    estimateAppt.EstApptNum = (max ?? 299) + 1;
                    estimateAppt.CreationDate = DateTime.Today.Date;

                }

                context.EstimateAppointments.Add(estimateAppt);

                var result = await context.SaveChangesAsync() > 0;

                if (!result) return Result<string>.Failure("Failed to create estimate appointment", 400);

                return Result<string>.Success(estimateAppt.Id);
            }
        }
    }
}
