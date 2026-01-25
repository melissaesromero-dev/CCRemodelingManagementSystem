// Application/Lookups/Queries/GetStates.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Lookups.Queries
{
    public static class GetStates
    {
        // DTO
        public sealed record StateDto(int Id, string ShortName, string LongName);

        // Request
        public sealed class Query : IRequest<IReadOnlyList<StateDto>> { }

        // Handler
        public sealed class Handler : IRequestHandler<Query, IReadOnlyList<StateDto>>
        {
            private readonly CCRemodelDbContext _context;
            public Handler(CCRemodelDbContext context) => _context = context;

            public async Task<IReadOnlyList<StateDto>> Handle(Query request, CancellationToken ct)
            {
                return await _context.States
                    .AsNoTracking()
                    .OrderBy(s => s.Id)
                    .Select(s => new StateDto(s.Id, s.ShortName, s.LongName))
                    .ToListAsync();
            }
        }
    }
}