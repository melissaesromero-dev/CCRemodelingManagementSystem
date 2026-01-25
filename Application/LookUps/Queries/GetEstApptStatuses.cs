// Application/Lookups/Queries/GetEstApptStatuses.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Lookups.Queries
{
    public static class GetEstApptStatuses
    {
        // DTO
        public sealed record EstApptStatusesDto(int Id, string Description);

        // Request
        public sealed class Query : IRequest<IReadOnlyList<EstApptStatusesDto>> { }

        // Handler
        public sealed class Handler : IRequestHandler<Query, IReadOnlyList<EstApptStatusesDto>>
        {
            private readonly CCRemodelDbContext _context;
            public Handler(CCRemodelDbContext context) => _context = context;

            public async Task<IReadOnlyList<EstApptStatusesDto>> Handle(Query request, CancellationToken ct)
            {
                return await _context.EstimateApptStatuses
                    .AsNoTracking()
                    .OrderBy(sr => sr.Id)
                    .Select(sr => new EstApptStatusesDto(sr.Id, sr.Description))
                    .ToListAsync();
            }
        }
    }
}