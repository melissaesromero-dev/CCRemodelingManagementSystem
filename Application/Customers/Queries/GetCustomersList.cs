using System;
using System.Linq;
using Application.ServiceRequests.Queries;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Customers.Queries;

public class GetCustomersList
{
    //Get All Customers 
    
    public class Query : IRequest<List<Customer>> {}

    public class Handler(CCRemodelDbContext context) : IRequestHandler<Query, List<Customer>>
    {
        public async Task<List<Customer>> Handle(Query request, CancellationToken cancellationToken)
        {
            //Load All Customers
            var customers = await context.Customers
                .AsNoTracking()
                .OrderBy(c => c.LastName)
                .ToListAsync();

            if (customers.Count == 0) return customers;

            //Build cust Id list
            var custIds = customers.ToDictionary(c => c.Id);

            //Service Requests count and ServiceRequest lists per customer
            var serviceRequests = await context.ServiceRequests
                .GroupBy(sr => sr.CustomerId)
                .Select(x => new
                {
                    CustomerId = x.Key,
                    Count = x.Count(),
                    SRList = x
                        .OrderBy(sr => sr.ReqNum)
                        .ToList()
                })
                .ToListAsync();

            foreach (var x in serviceRequests)
            {
                if (x.CustomerId is null || !custIds.TryGetValue(x.CustomerId, out var c)) continue;
                c.OpenRequestsCount = x.Count;
                c.OpenRequests = x.SRList;
            }

            //Estimate Appointments count and ApptNum List per customer
            var estimateAppointments = await context.EstimateAppointments
                .Join(context.ServiceRequests,
                      ea => ea.ServiceRequestId,
                      sr => sr.Id,
                      (ea, sr) => new { ea.ScheduledDate, ea.EstApptNum, sr.CustomerId })
                .GroupBy(x => x.CustomerId)
                .Select(g => new
                {
                    CustomerId = g.Key,
                    Count = g.Count(),
                    Numbers = g.OrderBy(x => x.EstApptNum).Select(x => x.EstApptNum).ToList(),
                    Dates = g.OrderBy(x => x.EstApptNum).Select(x => x.ScheduledDate ?? DateTime.MinValue).ToList()
                })
                .ToListAsync();

            foreach (var x in estimateAppointments)
            {
                if (x.CustomerId is null || !custIds.TryGetValue(x.CustomerId, out var c)) continue;
                c.EstApptsCount = x.Count;
                c.EstAppts = x.Numbers;
                c.EstApptDates = x.Dates;
            }

            //Quotes count and Quotes List per customer
            var quotes = await context.Quotes
                .Join(context.ServiceRequests,
                      q => q.ServiceRequestId,
                      sr => sr.Id,
                      (q, sr) => new { q, q.QuoteNum, sr.CustomerId })
                .GroupBy(x => x.CustomerId)
                .Select(g => new
                {
                    CustomerId = g.Key,
                    Count = g.Count(),
                    QuoteList = g
                        .OrderBy(x => x.q.QuoteNum)
                        .Select(x => x.q)
                        .ToList()                    
                })
                .ToListAsync();

            foreach (var x in quotes)
            {
                if (x.CustomerId is null || !custIds.TryGetValue(x.CustomerId, out var c)) continue;
                c.QuotesCount = x.Count;
                c.Quotes = x.QuoteList;
            }

            return customers;
        }
    }
}
