// Application/Lookups/Queries/GetSubTypes.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Lookups.Queries
{
    public static class GetSubTypes
    {
        // DTO
        public sealed record SubTypesDto(int Id, int MainTypeId, string Description);

        // Request
        public sealed class Query : IRequest<IReadOnlyList<SubTypesDto>> { }

        // Handler
        public sealed class Handler : IRequestHandler<Query, IReadOnlyList<SubTypesDto>>
        {
            private readonly CCRemodelDbContext _context;
            public Handler(CCRemodelDbContext context) => _context = context;

            public async Task<IReadOnlyList<SubTypesDto>> Handle(Query request, CancellationToken ct)
            {
                return await _context.ServiceSubTypes
                    .AsNoTracking()
                    .OrderBy(sst => sst.Id)
                    .Select(sst => new SubTypesDto(sst.Id, sst.MainTypeId, sst.Description))
                    .ToListAsync();
            }
        }
    }
}