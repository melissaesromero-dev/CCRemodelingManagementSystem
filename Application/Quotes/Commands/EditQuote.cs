using Application.Core;
using Application.Quotes.QuoteDTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Quotes.Commands
{
    public class EditQuote
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required EditQuoteDto QuoteDto { get; set; }
        }

        public class Handler(CCRemodelDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var quote = await context.Quotes
                    .FindAsync([request.QuoteDto.Id], cancellationToken);

                if (quote == null) return Result<Unit>.Failure("Quote not found", 404);

                mapper.Map(request.QuoteDto, quote);

                var hadMods = context.Entry(quote).State == EntityState.Modified;

                var wrote = await context.SaveChangesAsync(cancellationToken);
                if (wrote == 0)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
