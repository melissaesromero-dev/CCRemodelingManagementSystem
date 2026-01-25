using Application.Customers.Commands;
using Application.Customers.CustomerDTOs;
using Application.Customers.Queries;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CustomerController() : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Customer>>> GetAllCustomers()
    {
        return await Mediator.Send(new GetCustomersList.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Customer>> GetCustomerDetail(string id)
    {
        return HandleResult(await Mediator.Send(new GetCustomerDetails.Query { Id = id }));        
    }

    [HttpGet("serviceRequestsAndApptsByCustomer/{customerId}")]
    public async Task<ActionResult<CustomerServiceRequestsAndApptsDTO>> GetServiceRequestsAndAppts(string customerId)
    {
        return HandleResult(await Mediator.Send(
            new GetCustomerServiceRequestsAndAppts.Query { CustomerId = customerId }
        ));
    }



    [HttpPost]
    public async Task<ActionResult<string>> CreateCustomer(CreateCustomerDto customerDto)
    {
        return HandleResult(await Mediator.Send(new CreateCustomer.Command { CustomerDto = customerDto }));
    }

    [HttpPut]
    public async Task<ActionResult> EditCustomer(EditCustomerDto customer)
    {
        return HandleResult(await Mediator.Send(new EditCustomer.Command { CustomerDto = customer }));

    }

    [HttpDelete("{id}")]
    public async Task<ActionResult>DeleteCustomer(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteCustomer.Command{Id = id}));
    }

}
