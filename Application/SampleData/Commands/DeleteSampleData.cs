using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.SampleData.Commands
{
    public class DeleteSampleData
    {
        public class Command : IRequest<Result<Unit>> { }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly CCRemodelDbContext _context;

            public Handler(CCRemodelDbContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                await using var tx = await _context.Database.BeginTransactionAsync(cancellationToken);

                try
                {
                    var sampleAppts = await _context.EstimateAppointments
                        .Where(x => x.IsSampleData)
                        .ToListAsync(cancellationToken);
                    _context.EstimateAppointments.RemoveRange(sampleAppts);

                    var sampleQuotes = await _context.Quotes
                        .Where(x => x.IsSampleData)
                        .ToListAsync(cancellationToken);
                    _context.Quotes.RemoveRange(sampleQuotes);

                    var sampleReqs = await _context.ServiceRequests
                        .Where(x => x.IsSampleData)
                        .ToListAsync(cancellationToken);
                    _context.ServiceRequests.RemoveRange(sampleReqs);

                    var sampleCustomers = await _context.Customers
                        .Where(x => x.IsSampleData)
                        .ToListAsync(cancellationToken);
                    _context.Customers.RemoveRange(sampleCustomers);

                    await _context.SaveChangesAsync(cancellationToken);
                    await tx.CommitAsync(cancellationToken);

                    return Result<Unit>.Success(Unit.Value);
                }
                catch (Exception ex)
                {
                    await tx.RollbackAsync(cancellationToken);
                    return Result<Unit>.Failure($"Failed to delete sample data: {ex.Message}", 400);
                }
            }
        }
    }
}
