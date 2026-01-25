// Application/Lookups/Queries/GetAllCRSUsers.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Lookups.Queries
{
    public static class GetAllCRSUsers
    {
        // DTO
        public sealed record AllCRSUsersDto(string Id, string FullName);

        // Request
        public sealed class Query : IRequest<IReadOnlyList<AllCRSUsersDto>> { }

        // Handler
        public sealed class Handler : IRequestHandler<Query, IReadOnlyList<AllCRSUsersDto>>
        {
            private readonly CCRemodelDbContext _context;
            public Handler(CCRemodelDbContext context) => _context = context;

            public async Task<IReadOnlyList<AllCRSUsersDto>> Handle(Query request, CancellationToken ct)
            {
                return await _context.Users
                    .AsNoTracking()
                    .Where(u => u.UserTypeId != 3) //not customers
                    .OrderBy(u => u.LastName)
                    .Select(u => new AllCRSUsersDto(u.Id, u.FullName))
                    .ToListAsync();
            }
        }
    }
}