using Application.Quotes.QuoteDTOs;
using FluentValidation;

namespace Application.Quotes.Validators
{
    public class BaseQuoteValidator<T, TDto> : AbstractValidator<T> where TDto : BaseQuoteDto
    {
        public BaseQuoteValidator(Func<T, TDto> selector)
        {
            RuleFor(x => selector(x).ServiceRequestId).NotEmpty().WithMessage("Service request is required");
        }
    }
}
