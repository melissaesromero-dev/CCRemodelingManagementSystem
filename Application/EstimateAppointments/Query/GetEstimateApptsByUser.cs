using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.EstimateAppointments.Query
{
    public class GetEstimateApptsByUser
    {
        public class Query : IRequest<List<EstimateAppointment>> 
        {
            public required string UserId { get; set; }
        }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Query, List<EstimateAppointment>>
        {
            public async Task<List<EstimateAppointment>> Handle(Query request, CancellationToken cancellationToken)
            {
                var now = DateTime.Now;
                var today = now.Date;
                
                var baseQuery =
                    from ea in context.EstimateAppointments.AsNoTracking()
                    join sr in context.ServiceRequests.AsNoTracking()
                        on ea.ServiceRequestId equals sr.Id
                    where sr.UserId == request.UserId
                          && ea.StatusId == 2
                          && ea.ScheduledDate >= today
                    select ea;

                var apptList = await baseQuery.ToListAsync(cancellationToken);

                var finalApptList = apptList
                    .Where(ea => ea.FullDate >= now)
                    .ToList();

                return finalApptList;

            }
        }
    }
}
