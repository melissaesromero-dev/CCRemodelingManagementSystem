using Application.PublicQuote.PublicQuoteDTOs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.PublicQuote.Validators
{
    public class PublicQuoteValidator : AbstractValidator<SubmitQuoteRequestDto>
    {
        public PublicQuoteValidator() { 
        
            // Customer rules (mirror BaseCustomerValidator messages)
            
            RuleFor(x => x.FirstName)
                    .NotEmpty().WithMessage("First name is required");

            RuleFor(x => x.LastName)
                    .NotEmpty().WithMessage("Last name is required");

            RuleFor(x => x.Email)
                    .NotEmpty().WithMessage("Email is rquired")
                    .EmailAddress().WithMessage("Email must be valid");

            RuleFor(x => x.Phone)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty().WithMessage("Phone is required")
                    .Must(p => Regex.Replace(p ?? string.Empty, @"\D", "").Length == 10)
                    .WithMessage("Phone must have 10 digits");

            RuleFor(x => x.City)
                    .NotEmpty().WithMessage("City is required");

            RuleFor(x => x.StateId)
                    .GreaterThan(0).WithMessage("State is required");

            
            // Service Request rules 
            
            RuleFor(x => x.MainServiceTypeId)
                    .GreaterThan(0).WithMessage("Please select the service main type");

            RuleFor(x => x.ServiceDesc)
                    .NotEmpty().WithMessage("Service description is required")
                    .MaximumLength(4000).WithMessage("Your description is too long");

            RuleFor(x => x.ServiceAddress)
                    .NotEmpty().WithMessage("Service address is required");

            RuleFor(x => x.ServiceCity)
                    .NotEmpty().WithMessage("Service city is required");

            RuleFor(x => x.ServiceStateId)
                    .NotEmpty().WithMessage("Service state is required")
                    .Equal(38).WithMessage("Currently, we only service Pennsylvania. Please select PA for state.");

            //
            // PublicQuote-specific rules (not covered by your base validators)
            //
            //RuleFor(x => x.BudgetRangeId)
            //        .NotEmpty().WithMessage("Budget range is required");

            // If DesiredStartDate is provided, it can't be in the past.
            RuleFor(x => x.DesiredStartDate)
                    .Must(d => !d.HasValue || d.Value.Date >= DateTime.Today)
                    .WithMessage("Desired start date cannot be in the past.");

            
        }
    }
}
