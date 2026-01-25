using System;
using System.Linq;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.ServiceRequests.Queries;

public class GetServiceRequestsList
{
    //Get All Service Requests 

    public class Query : IRequest<List<ServiceRequest>> { }

    public class Handler(CCRemodelDbContext context) : IRequestHandler<Query, List<ServiceRequest>>
    {
        public async Task<List<ServiceRequest>> Handle(Query request, CancellationToken cancellationToken)
        {
            //Load All Requests
            var requests = await context.ServiceRequests
                .AsNoTracking()
                .OrderBy(x => x.ReqNum)
                .ToListAsync();

            if (requests.Count == 0) return requests;

            //Load all lookup tables needed
            //Customers
            var allCustomers = await context.Customers
                .AsNoTracking()
                .ToDictionaryAsync(c => c.Id, c=>c);

            //Users (Staff)
            var allUsers = await context.Users
                .AsNoTracking()
                .ToDictionaryAsync(u => u.Id, u => u);

            //MainServiceType
            var mainService = await context.ServiceMainTypes
                .AsNoTracking()
                .ToDictionaryAsync(ms => ms.Id, ms => ms.Description);

            //SubServiceType
            var subService = await context.ServiceSubTypes
                .AsNoTracking()
                .ToDictionaryAsync(ss => ss.Id, ss => ss.Description);

            //EstimateAppointment
            var estApptsStatuses = await context.EstimateApptStatuses
                .AsNoTracking()
                .ToDictionaryAsync(eas => eas.Id, eas => eas.Description);

            //Quote Numbers
            var quotes = await context.Quotes
                .AsNoTracking()
                .ToListAsync();
                        
            //Map values for each request
            foreach (var req in requests)
            {
                //Set values for CustFullName, StaffFullName, MainServiceTypeDesc, SubServiceTypeDesc, EstApptStatus, QuoteNum, and UploadsList
                req.CustFullName = allCustomers.TryGetValue(req.CustomerId, out var c) ? c.FullName : "Unknown Customer";
                req.StaffFullName = !string.IsNullOrWhiteSpace(req.UserId) && allUsers.TryGetValue(req.UserId, out var u) ? u.FullName : "No Staff Assigned";
                req.MainServiceTypeDesc = mainService.GetValueOrDefault(req.MainServiceTypeId) ?? string.Empty;
                req.SubServiceTypeDesc = subService.GetValueOrDefault(req.SubServiceTypeId) ?? string.Empty;
                req.EstApptStatus = await context.EstimateAppointments
                    .AsNoTracking()
                    .Where(ea => ea.ServiceRequestId == req.Id)
                    .Join(context.EstimateApptStatuses,
                        ea => ea.StatusId,
                        eas => eas.Id,
                        (ea, eas) => eas.Description)
                    .FirstOrDefaultAsync();
                req.QuoteNum = quotes
                    .Where(q => q.ServiceRequestId == req.Id)
                    .Select(q => q.QuoteNum)
                    .FirstOrDefault();

                                
            }

            return requests;
        }

    }
}
