using Application.Core;
using Domain;
using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Quotes.Queries
{
    public class GetQuoteDetails
    {
        public class Query : IRequest<Result<Quote>>
        {
            public required string Id { get; set; }
        }

        public class Handler(CCRemodelDbContext context) : IRequestHandler<Query, Result<Quote>>
        {
            public async Task<Result<Quote>> Handle(Query request, CancellationToken cancellationToken)
            {
                var quote = await context.Quotes.FindAsync([request.Id], cancellationToken);

                if (quote == null) return Result<Quote>.Failure("Quote not found", 404);

                return Result<Quote>.Success(quote);

            }
        }
    }
}
