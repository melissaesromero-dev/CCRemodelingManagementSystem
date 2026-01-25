using Application.Customers.Commands;
using Application.Customers.CustomerDTOs;
using Application.EstimateAppointments.Commands;
using Application.EstimateAppointments.EstimateApptDTOs;
using Application.EstimateAppointments.Query;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class EstimateAppointmentController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<EstimateAppointment>>> GetEstimateApptsList()
    {
        return await Mediator.Send(new GetEstimateApptsList.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EstimateAppointment>> GetEstimateApptDetails(string id)
    {
        return HandleResult(await Mediator.Send(new GetEstimateApptDetails.Query { Id = id }));
    }

    [HttpGet("byUser/{userId}")]
    public async Task<ActionResult<List<EstimateAppointment>>> GetEstimateApptsByUser(string userId)
    {
        return await Mediator.Send(new GetEstimateApptsByUser.Query { UserId = userId});
    }

    [HttpGet("byReqId/{reqId}")]
    public async Task<ActionResult<EstimateAppointment>> GetEstimateApptDetailsByReqId(string reqid)
    {
        var result = await Mediator.Send(new GetEstimateApptDetailsByReqId.Query { ReqId = reqid });

        //if it's a real failure
        if(!result.IsSuccess)
        {
            if (result.Code == 404) return NotFound();
            return BadRequest(result.Error);
        }

        //result.Value may be an estimate appt or null, either one is 200 OK
        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateEstimateAppt(CreateEstimateApptDto estimateApptDto)
    {
        return HandleResult(await Mediator.Send(new CreateEstimateAppt.Command { EstimateApptDto = estimateApptDto }));
    }


    [HttpPut]
    public async Task<ActionResult> EditEstimateAppt(EditEstimateApptDto estimateAppt)
    {
        return HandleResult(await Mediator.Send(new EditEstimateAppt.Command { EstimateApptDto = estimateAppt }));

    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteEstimateAppt(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteEstimateAppt.Command { Id = id }));

    }

    [HttpDelete("byReqId/{reqid}")]
    public async Task<ActionResult> DeleteEstimateApptByReqId(string reqid)
    {
        return HandleResult(await Mediator.Send(new DeleteEstimateApptByReqId.Command { ReqId = reqid }));

    }

}
