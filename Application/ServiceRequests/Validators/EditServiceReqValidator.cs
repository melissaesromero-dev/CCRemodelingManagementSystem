using Application.Customers.Commands;
using Application.Customers.CustomerDTOs;
using Application.Customers.Validators;
using Application.ServiceRequests.Commands;
using Application.ServiceRequests.ServiceReqDTOs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ServiceRequests.Validators
{
    public class EditServiceReqValidator : BaseServiceReqValidator<EditServiceRequest.Command, EditServiceReqDto>
    {
        public EditServiceReqValidator() : base(x => x.ServiceReqDto)
        {
            RuleFor(x => x.ServiceReqDto.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
