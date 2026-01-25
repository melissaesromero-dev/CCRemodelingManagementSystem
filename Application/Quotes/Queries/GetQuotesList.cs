using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Quotes.Queries
{
    public class GetQuotesList
    {
        //Get All Service Requests 
        public class Query : IRequest<List<Quote>> { }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Query, List<Quote>>
        {
            public async Task<List<Quote>> Handle(Query request, CancellationToken cancellationToken)
            {
                //Load All Quotes
                var quotes = await context.Quotes
                    .AsNoTracking()
                    .OrderBy(x => x.QuoteNum)
                    .ToListAsync();

                if (quotes.Count == 0) return quotes;

                //Load all lookup tables needed
                //Service Request
                var allServiceRequests = await context.ServiceRequests
                    .AsNoTracking()
                    .ToDictionaryAsync(sr => sr.Id, sr => sr);

                //MainServiceType
                var mainService = await context.ServiceMainTypes
                    .AsNoTracking()
                    .ToDictionaryAsync(ms => ms.Id, ms => ms.Description);

                //SubServiceType
                var subService = await context.ServiceSubTypes
                    .AsNoTracking()
                    .ToDictionaryAsync(ss => ss.Id, ss => ss.Description);

                //Map values for each request
                foreach (var q in quotes)
                {
                    //Set values for ServiceReqNum, MainServiceTypeDesc, SubServiceTypeDesc
                    
                    //Get related service request (if any)
                    if (allServiceRequests.TryGetValue(q.ServiceRequestId, out var sr))
                    {
                        //Service request num
                        q.RequestNumber = sr.ReqNum;

                        //Main service type description
                        if (mainService.TryGetValue(sr.MainServiceTypeId, out var mainDesc))
                        {
                            q.ServiceMainTypeDesc = mainDesc;
                        }
                        else
                        {
                            q.ServiceMainTypeDesc = null;
                        }

                        //Sub service type description
                        if (subService.TryGetValue(sr.SubServiceTypeId, out var subDesc))
                        {
                            q.ServiceSubTypeDesc = subDesc;
                        }
                        else
                        {
                            q.ServiceSubTypeDesc = null;
                        }
                    }
                    else 
                    {
                        //if no matching service request is found
                        q.RequestNumber = 0;
                        q.ServiceMainTypeDesc = null;
                        q.ServiceSubTypeDesc= null;
                    }
                    
                    
                }

                return quotes;
            }

        }
    }
}
