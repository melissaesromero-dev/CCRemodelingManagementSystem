using Application.ServiceRequests.ServiceReqDTOs;
using FluentValidation;

namespace Application.ServiceRequests.Validators
{
    public class BaseServiceReqValidator<T, TDto> : AbstractValidator<T> where TDto : BaseServiceReqDto
    {
        public BaseServiceReqValidator(Func<T, TDto> selector)
        {
            RuleFor(x => selector(x).CustomerId)
                .NotEmpty().WithMessage("Customer is required");
                        
            RuleFor(x => selector(x).MainServiceTypeId)
                .NotEmpty().WithMessage("Please select the service main type");

            RuleFor(x => selector(x).ServiceDesc)
                .NotEmpty().WithMessage("Service description is required")
                .MaximumLength(4000).WithMessage("Your description is too long");

            RuleFor(x => selector(x).ServiceAddress)
                .NotEmpty().WithMessage("Service address is required");

            RuleFor(x => selector(x).ServiceCity)
                .NotEmpty().WithMessage("Service city is required");

            RuleFor(x => selector(x).ServiceStateId)
                .NotEmpty().WithMessage("Service state is required")
                .Equal(38).WithMessage("Currently, we only service Pennsylvania. Please select PA for state.");
        }
    }
}
