using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.EstimateAppointments.Query
{
    public class GetEstimateApptDetailsByReqId
    {
        public class Query : IRequest<Result<EstimateAppointment>>
        {
            public required string ReqId { get; set; }
        }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Query, Result<EstimateAppointment>>
        {
            public async Task<Result<EstimateAppointment>> Handle(Query request, CancellationToken cancellationToken)
            {
                var estimateAppt = await context.EstimateAppointments
                    .FirstOrDefaultAsync(
                        ea => ea.ServiceRequestId == request.ReqId,
                        cancellationToken
                    );

                //if (estimateAppt == null) return Result<EstimateAppointment>.Failure("Estimate appointment not found", 404);

                return Result<EstimateAppointment>.Success(estimateAppt);

            }
        }
    }
}
