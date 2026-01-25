// Application/Lookups/Queries/GetMainTypes.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Lookups.Queries
{
    public static class GetMainTypes
    {
        // DTO
        public sealed record MainTypesDto(int Id, string Description);

        // Request
        public sealed class Query : IRequest<IReadOnlyList<MainTypesDto>> { }

        // Handler
        public sealed class Handler : IRequestHandler<Query, IReadOnlyList<MainTypesDto>>
        {
            private readonly CCRemodelDbContext _context;
            public Handler(CCRemodelDbContext context) => _context = context;

            public async Task<IReadOnlyList<MainTypesDto>> Handle(Query request, CancellationToken ct)
            {
                return await _context.ServiceMainTypes
                    .AsNoTracking()
                    .OrderBy(mst => mst.Id)
                    .Select(mst => new MainTypesDto(mst.Id, mst.Description))
                    .ToListAsync();
            }
        }
    }
}