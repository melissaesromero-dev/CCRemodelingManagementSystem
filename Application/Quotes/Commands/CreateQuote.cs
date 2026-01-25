using Application.Core;
using Application.Quotes.QuoteDTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Quotes.Commands
{
    public class CreateQuote
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateQuoteDto QuoteDto { get; set; }
        }

        public class Handler(CCRemodelDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var quote = mapper.Map<Quote>(request.QuoteDto);

                var serviceRequest = await context.ServiceRequests
                    .AsNoTracking()
                    .FirstOrDefaultAsync(
                        sr => sr.Id == quote.ServiceRequestId,
                        cancellationToken
                    );

                if (serviceRequest == null)
                    return Result<string>.Failure("Service request not found", 404);

                quote.IsSampleData = serviceRequest.IsSampleData;

                // Assign next QuoteNum with a small optimistic retry in case of rare race (unique index)
                const int maxRetries = 3;
                for (var attempt = 1; attempt <= maxRetries; attempt++)
                {
                    // NULL-safe max
                    var max = await context.Quotes
                        .AsNoTracking()
                        .Where(q => q.IsSampleData == quote.IsSampleData)
                        .MaxAsync(q => (int?)q.QuoteNum);

                    quote.QuoteNum = (max ?? 99) + 1;
                    quote.CreationDate = DateTime.Today.Date;

                }
                context.Quotes.Add(quote);

                var result = await context.SaveChangesAsync() > 0;

                if (!result) return Result<string>.Failure("Failed to create quote", 400);

                return Result<string>.Success(quote.Id);
            }
        }        
    }
}
