using Application.ServiceRequests.Commands;
using Application.ServiceRequests.ServiceReqDTOs;
using Application.ServiceRequests.Validators;

public class CreateServiceReqValidator : BaseServiceReqValidator<CreateServiceRequest.Command, CreateServiceReqDto>
{
    public CreateServiceReqValidator() : base(x => x.ServiceReqDto)
    {

    }
}

