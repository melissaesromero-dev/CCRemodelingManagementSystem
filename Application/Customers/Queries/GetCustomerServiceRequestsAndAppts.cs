using Application.Core;
using Application.Customers.CustomerDTOs;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Customers.Queries
{
    public class GetCustomerServiceRequestsAndAppts
    {
        public class Query : IRequest<Result<CustomerServiceRequestsAndApptsDTO>>
        {
            public string CustomerId { get; set; } = string.Empty;
        }

        public class Handler : IRequestHandler<Query, Result<CustomerServiceRequestsAndApptsDTO>>
        {
            private readonly CCRemodelDbContext _context;

            public Handler(CCRemodelDbContext context)
            {
                _context = context;
            }

            public async Task<Result<CustomerServiceRequestsAndApptsDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                // ONLY COUNT *active* service requests (not completed or closed)
                var serviceRequestCount = await _context.ServiceRequests
                    .Where(sr =>
                        sr.CustomerId == request.CustomerId &&
                        sr.StatusId != 5 &&  // Completed
                        sr.StatusId != 6     // Closed
                    )
                    .CountAsync(cancellationToken);

                // ONLY COUNT *open* estimate appointments
                // StatusId 2 = Completed (adjust to your codes)
                // Get all service request IDs for this customer
                var srIdsForCustomer = _context.ServiceRequests
                    .Where(sr => sr.CustomerId == request.CustomerId)
                    .Select(sr => sr.Id);

                // Count estimate appts whose ServiceRequestId belongs to those SRs and are not completed
                var estimateApptCount = await _context.EstimateAppointments
                    .Where(ea =>
                        ea.StatusId != 2 &&
                        ea.StatusId != 5 && // not completed
                        srIdsForCustomer.Contains(ea.ServiceRequestId)
                    )
                    .CountAsync(cancellationToken);

                var dto = new CustomerServiceRequestsAndApptsDTO(
                    serviceRequestCount,
                    estimateApptCount
                );

                return Result<CustomerServiceRequestsAndApptsDTO>.Success(dto);
            }
        }
    }
    
}