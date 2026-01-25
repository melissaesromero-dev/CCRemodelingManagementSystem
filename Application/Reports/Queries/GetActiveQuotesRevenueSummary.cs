using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Reports.Queries
{
    public class GetActiveQuotesRevenueSummary
    {
        public class Query : IRequest<Result<ActiveQuotesRevenueSummaryDto>>
        {
        }

        public class Handler(CCRemodelDbContext context)
            : IRequestHandler<Query, Result<ActiveQuotesRevenueSummaryDto>>
        {
            public async Task<Result<ActiveQuotesRevenueSummaryDto>> Handle(
                Query request,
                CancellationToken cancellationToken)
            {
                var activeQuotes = context.Quotes
                    .Where(q =>
                        q.StatusId != 4);

                var summary = new ActiveQuotesRevenueSummaryDto
                {
                    ActiveQuoteCount = await activeQuotes.CountAsync(cancellationToken),
                    TotalPotentialIncome = await activeQuotes
                        .SumAsync(q => q.LaborCostEstimate + q.MaterialCostEstimate, cancellationToken)
                };

                return Result<ActiveQuotesRevenueSummaryDto>.Success(summary);
            }
        }
    }
}
