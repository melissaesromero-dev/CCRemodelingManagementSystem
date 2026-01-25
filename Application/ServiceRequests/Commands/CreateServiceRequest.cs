using Application.Core;
using Application.ServiceRequests.ServiceReqDTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.ServiceRequests.Commands
{
    public class CreateServiceRequest
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateServiceReqDto ServiceReqDto { get; set; }
        }

        public class Handler(CCRemodelDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var serviceReq = mapper.Map<ServiceRequest>(request.ServiceReqDto);

                var customer = await context.Customers
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Id == serviceReq.CustomerId, cancellationToken);

                if (customer == null)
                    return Result<string>.Failure("Customer not found", 404);

                serviceReq.IsSampleData = customer.IsSampleData;

                // Assign next ReqNum with a small optimistic retry in case of rare race (unique index)
                const int maxRetries = 3;
                for (var attempt = 1; attempt <= maxRetries; attempt++)
                {
                    // NULL-safe max
                    var max = await context.ServiceRequests
                        .AsNoTracking()
                        .Where(sr => sr.IsSampleData == serviceReq.IsSampleData)
                        .MaxAsync(sr => (int?)sr.ReqNum);

                    serviceReq.ReqNum = (max ?? 1999) + 1;
                    serviceReq.CreationDate = DateTime.Today.Date;

                }

                context.ServiceRequests.Add(serviceReq);

                var result = await context.SaveChangesAsync() > 0;

                if (!result) return Result<string>.Failure("Failed to create service request", 400);

                return Result<string>.Success(serviceReq.Id);

            }
        }
    }
}