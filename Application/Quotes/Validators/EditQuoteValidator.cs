using Application.Quotes.Commands;
using Application.Quotes.QuoteDTOs;
using FluentValidation;

namespace Application.Quotes.Validators
{
    public class EditQuoteValidator : BaseQuoteValidator<EditQuote.Command, EditQuoteDto>
    {
        public EditQuoteValidator() : base(x => x.QuoteDto)
        {
            RuleFor(x => x.QuoteDto.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
