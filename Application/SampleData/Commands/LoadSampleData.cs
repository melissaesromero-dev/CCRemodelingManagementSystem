using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.SampleData.Commands
{
    public class LoadSampleData
    {
        public class Command : IRequest<Result<string>> { }

        public class Handler : IRequestHandler<Command, Result<string>>
        {
            private readonly CCRemodelDbContext _context;

            public Handler(CCRemodelDbContext context)
            {
                _context = context;
            }

            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var exists = await _context.Customers
                    .AsNoTracking()
                    .AnyAsync(c => c.IsSampleData, cancellationToken);

                if (exists)
                    return Result<string>.Success("Sample data already exists.");

                await SampleDataSeeder.SeedDataAsync(_context);

                return Result<string>.Success("Sample data loaded.");
            }
        }
    }
}
