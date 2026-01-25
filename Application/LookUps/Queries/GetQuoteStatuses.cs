// Application/Lookups/Queries/GetQuoteStatuses.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Lookups.Queries
{
    public static class GetQuoteStatuses
    {
        // DTO
        public sealed record QuoteStatusesDto(int Id, string Description);

        // Request
        public sealed class Query : IRequest<IReadOnlyList<QuoteStatusesDto>> { }

        // Handler
        public sealed class Handler : IRequestHandler<Query, IReadOnlyList<QuoteStatusesDto>>
        {
            private readonly CCRemodelDbContext _context;
            public Handler(CCRemodelDbContext context) => _context = context;

            public async Task<IReadOnlyList<QuoteStatusesDto>> Handle(Query request, CancellationToken ct)
            {
                return await _context.QuoteStatuses
                    .AsNoTracking()
                    .OrderBy(qs => qs.Id)
                    .Select(qs => new QuoteStatusesDto(qs.Id, qs.Description))
                    .ToListAsync();
            }
        }
    }
}