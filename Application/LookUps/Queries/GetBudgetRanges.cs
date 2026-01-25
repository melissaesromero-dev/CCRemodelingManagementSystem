// Application/Lookups/Queries/GetBudgetRanges.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Lookups.Queries
{
    public static class GetBudgetRanges
    {
        // DTO
        public sealed record BudgetRangesDto(int Id, string Description);

        // Request
        public sealed class Query : IRequest<IReadOnlyList<BudgetRangesDto>> { }

        // Handler
        public sealed class Handler : IRequestHandler<Query, IReadOnlyList<BudgetRangesDto>>
        {
            private readonly CCRemodelDbContext _context;
            public Handler(CCRemodelDbContext context) => _context = context;

            public async Task<IReadOnlyList<BudgetRangesDto>> Handle(Query request, CancellationToken ct)
            {
                return await _context.BudgetRanges
                    .AsNoTracking()
                    .OrderBy(br => br.Id)
                    .Select(br => new BudgetRangesDto(br.Id, br.Description))
                    .ToListAsync();
            }
        }
    }
}