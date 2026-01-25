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
    public class GetEstimateApptsList
    {
        //Get All Service Requests 
        public class Query : IRequest<List<EstimateAppointment>> { }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Query, List<EstimateAppointment>>
        {
            public async Task<List<EstimateAppointment>> Handle(Query request, CancellationToken cancellationToken)
            {
                //Load All Estimate Appointments
                var estimateAppts = await context.EstimateAppointments
                    .OrderBy(x => x.EstApptNum)
                    .ToListAsync();

                if (estimateAppts.Count == 0) return estimateAppts;

                // Auto-missed past scheduled appointments
                
                const int STATUS_SCHEDULED = 1;
                const int STATUS_MISSED = 4;

                var now = DateTime.Now;
                var anyStatusChanged = false;

                foreach (var ea in estimateAppts)
                {
                    if (ea.StatusId != STATUS_SCHEDULED)
                        continue;

                    // If both date and time are present, use full date-time
                    if (ea.ScheduledDate.HasValue && ea.ScheduledTime.HasValue)
                    {
                        var scheduledLocal = ea.ScheduledDate.Value.Date + ea.ScheduledTime.Value;

                        if (scheduledLocal < now)
                        {
                            ea.StatusId = STATUS_MISSED;
                            anyStatusChanged = true;
                        }
                    }
                    // If we somehow have a date but no time, fall back to date-only logic
                    else if (ea.ScheduledDate.HasValue)
                    {
                        if (ea.ScheduledDate.Value.Date < now.Date)
                        {
                            ea.StatusId = STATUS_MISSED;
                            anyStatusChanged = true;
                        }
                    }
                }

                if (anyStatusChanged)
                {
                    await context.SaveChangesAsync(cancellationToken);
                }

                //Load all lookup tables needed
                //Service Request
                var allServiceRequests = await context.ServiceRequests
                    .AsNoTracking()
                    .ToDictionaryAsync(sr => sr.Id, sr => sr);

                //Customers
                var allCustomers = await context.Customers
                    .AsNoTracking()
                    .ToDictionaryAsync(c => c.Id, c => c);

                //Users (Staff)
                var allUsers = await context.Users
                    .AsNoTracking()
                    .ToDictionaryAsync(u => u.Id, u => u);

                //Map values for each estimate appt
                foreach (var ea in estimateAppts)
                {
                    //Set values for ServiceReqNum, CustomerFullName, StaffFullName
                    if (allServiceRequests.TryGetValue(ea.ServiceRequestId, out var sr) && sr is not null)
                    {
                        ea.RequestNumber = sr.ReqNum;
                        
                        if (allCustomers.TryGetValue(sr.CustomerId, out var cust) && cust is not null)
                            ea.CustFullName = cust.FullName ?? "";
                        else
                            ea.CustFullName = "";

                        if (allUsers.TryGetValue(sr.UserId, out var u) && u is not null)
                            ea.StaffFullName = $"{u.FirstName} {u.LastName}";
                        else
                        {
                            ea.StaffFullName = "";
                        }
                    }
                    else
                    {
                        ea.RequestNumber = 0;
                        ea.CustFullName = "";
                        ea.StaffFullName = "";
                    }
                }
                return estimateAppts;
            }

        }
    }
}
