using Application.Customers.Commands;
using Application.Customers.CustomerDTOs;
using Application.ServiceRequests.Commands;
using Application.ServiceRequests.Queries;
using Application.ServiceRequests.ServiceReqDTOs;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ServiceRequestController() : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<ServiceRequest>>> GetServiceRequestsList()
    {
        return await Mediator.Send(new GetServiceRequestsList.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceRequest>> GetServiceRequestDetails(string id)
    {
        return HandleResult(await Mediator.Send(new GetServiceRequestDetails.Query { Id = id}));
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateServiceRequest(CreateServiceReqDto serviceRequestDto)
    {
        return HandleResult(await Mediator.Send(new CreateServiceRequest.Command { ServiceReqDto = serviceRequestDto }));
    }

    [HttpPut]
    public async Task<ActionResult> EditServiceRequest(EditServiceReqDto serviceRequest)
    {
        return HandleResult(await Mediator.Send(new EditServiceRequest.Command { ServiceReqDto = serviceRequest }));

    }


    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteServiceRequest(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteServiceRequest.Command { Id = id }));

    }
}
