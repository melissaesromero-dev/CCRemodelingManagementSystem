using Application.Customers.CustomerDTOs;
using FluentValidation;
using System.Text.RegularExpressions;

namespace Application.Customers.Validators
{
    public class BaseCustomerValidator<T, TDto> : AbstractValidator<T> where TDto : BaseCustomerDto
    {
        public BaseCustomerValidator(Func<T, TDto> selector)
        {
            RuleFor(x => selector(x).FirstName)
                .NotEmpty().WithMessage("First name is required");

            RuleFor(x => selector(x).LastName)
                .NotEmpty().WithMessage("Last name is required");

            RuleFor(x => selector(x).Email)
                .NotEmpty().WithMessage("Email is rquired")
                .EmailAddress().WithMessage("Email must be valid");

            RuleFor(x => selector(x).Phone)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Phone is required")
                .Must(p => Regex.Replace(p ?? string.Empty, @"\D", "").Length == 10)
                .WithMessage("Phone must have 10 digits");

            RuleFor(x => selector(x).City)
                .NotEmpty().WithMessage("City is required");

            RuleFor(x => selector(x).StateId)
                .NotEmpty().WithMessage("State is required");
        }
    }
}
