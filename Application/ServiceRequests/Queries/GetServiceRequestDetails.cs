using Application.Core;
using Domain;
using MediatR;
using Persistence;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ServiceRequests.Queries
{
    public class GetServiceRequestDetails
    {
        public class Query : IRequest<Result<ServiceRequest>>
        { 
            public required string Id { get; set; }
        }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Query, Result<ServiceRequest>>
        {
            public async Task<Result<ServiceRequest>> Handle(Query request, CancellationToken cancellationToken)
            {
                var serviceReq = await context.ServiceRequests.FindAsync([request.Id], cancellationToken);

                if (serviceReq == null) return Result<ServiceRequest>.Failure("Service request not found", 404);

                return Result<ServiceRequest>.Success(serviceReq);

            }
        }
    }
}

       