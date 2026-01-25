using Application.Quotes.Commands;
using Application.Quotes.QuoteDTOs;

namespace Application.Quotes.Validators
{
    public class CreateQuoteValidator : BaseQuoteValidator<CreateQuote.Command, CreateQuoteDto>
    {
        public CreateQuoteValidator() : base(x => x.QuoteDto)
        {

        }
    }
}