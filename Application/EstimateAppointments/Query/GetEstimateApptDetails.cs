using Application.Core;
using Domain;
using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.EstimateAppointments.Query
{
    public class GetEstimateApptDetails
    {
        public class Query : IRequest<Result<EstimateAppointment>>
        {
            public required string Id { get; set; }
        }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Query, Result<EstimateAppointment>>
        {
            public async Task <Result<EstimateAppointment>> Handle(Query request, CancellationToken cancellationToken)
            {
                var estimateAppt = await context.EstimateAppointments.FindAsync([request.Id], cancellationToken);

                if (estimateAppt == null) return Result<EstimateAppointment>.Failure("Estimate appointment not found", 404);

                return Result<EstimateAppointment>.Success(estimateAppt);

            }
        }
    }
}
