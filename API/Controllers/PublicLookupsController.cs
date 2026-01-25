using Application.Lookups.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [EnableCors("PublicWeb")]
    [AllowAnonymous]
    [Route("api/public/lookups")]
    public class PublicLookupsController : BaseApiController
    {
        // GET api/public/lookups/states
        [HttpGet("states")]
        public async Task<ActionResult<IReadOnlyList<GetStates.StateDto>>> GetStates(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetStates.Query(), ct);
            return Ok(result);
        }

        // GET api/public/lookups/budgetRanges
        [HttpGet("budgetRanges")]
        public async Task<ActionResult<IReadOnlyList<GetBudgetRanges.BudgetRangesDto>>> GetBudgetRanges(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetBudgetRanges.Query(), ct);
            return Ok(result);
        }

        // GET api/public/lookups/bestTimes
        [HttpGet("bestTimes")]
        public async Task<ActionResult<IReadOnlyList<GetBestTimes.BestTimeDto>>> GetBestTimes(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetBestTimes.Query(), ct);
            return Ok(result);
        }

        // GET api/public/lookups/contactMethods
        [HttpGet("contactMethods")]
        public async Task<ActionResult<IReadOnlyList<GetContactMethods.ContactMethodsDto>>> GetContactMethods(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetContactMethods.Query(), ct);
            return Ok(result);
        }

        // GET /api/public/lookups/mainTypes
        [HttpGet("mainTypes")]
        public async Task<ActionResult<IReadOnlyList<GetMainTypes.MainTypesDto>>> GetMainTypes(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetMainTypes.Query(), ct);
            return Ok(result);
        }

    }
}
