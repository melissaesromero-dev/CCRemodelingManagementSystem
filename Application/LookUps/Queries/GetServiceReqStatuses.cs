// Application/Lookups/Queries/GetServiceReqStatuses.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Lookups.Queries
{
    public static class GetServiceReqStatuses
    {
        // DTO
        public sealed record ServiceReqStatusesDto(int Id, string Description);

        // Request
        public sealed class Query : IRequest<IReadOnlyList<ServiceReqStatusesDto>> { }

        // Handler
        public sealed class Handler : IRequestHandler<Query, IReadOnlyList<ServiceReqStatusesDto>>
        {
            private readonly CCRemodelDbContext _context;
            public Handler(CCRemodelDbContext context) => _context = context;

            public async Task<IReadOnlyList<ServiceReqStatusesDto>> Handle(Query request, CancellationToken ct)
            {
                return await _context.ServiceRequestStatuses
                    .AsNoTracking()
                    .OrderBy(sr => sr.Id)
                    .Select(sr => new ServiceReqStatusesDto(sr.Id, sr.Description))
                    .ToListAsync();
            }
        }
    }
}