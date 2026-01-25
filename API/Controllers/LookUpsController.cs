using Application.Lookups.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LookUpsController : BaseApiController
    {
        // GET /api/lookups/states
        [HttpGet("states")]
        public async Task<ActionResult<IReadOnlyList<GetStates.StateDto>>> GetStates(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetStates.Query(), ct);
            return Ok(result);
        }

        // GET /api/lookups/budgetRanges
        [HttpGet("budgetRanges")]
        public async Task<ActionResult<IReadOnlyList<GetBudgetRanges.BudgetRangesDto>>> GetBudgetRanges(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetBudgetRanges.Query(), ct);
            return Ok(result);
        }

        // GET /api/lookups/serviceReqStatuses
        [HttpGet("serviceReqStatuses")]
        public async Task<ActionResult<IReadOnlyList<GetServiceReqStatuses.ServiceReqStatusesDto>>> GetServiceReqStatuses(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetServiceReqStatuses.Query(), ct);
            return Ok(result);
        }

        // GET /api/lookups/bestTimes
        [HttpGet("bestTimes")]
        public async Task<ActionResult<IReadOnlyList<GetBestTimes.BestTimeDto>>> GetBestTimes(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetBestTimes.Query(), ct);
            return Ok(result);
        }

        // GET /api/lookups/contactMethods
        [HttpGet("contactMethods")]
        public async Task<ActionResult<IReadOnlyList<GetContactMethods.ContactMethodsDto>>> GetContactMethods(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetContactMethods.Query(), ct);
            return Ok(result);
        }

        // GET /api/lookups/allCRSUsers, company employee users, not customers
        [HttpGet("allCRSUsers")]
        public async Task<ActionResult<IReadOnlyList<GetAllCRSUsers.AllCRSUsersDto>>> GetAllCRSUsers(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetAllCRSUsers.Query(), ct);
            return Ok(result);
        }

        // GET /api/lookups/mainTypes
        [HttpGet("mainTypes")]
        public async Task<ActionResult<IReadOnlyList<GetMainTypes.MainTypesDto>>> GetMainTypes(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetMainTypes.Query(), ct);
            return Ok(result);
        }

        // GET /api/lookups/subTypes
        [HttpGet("subTypes")]
        public async Task<ActionResult<IReadOnlyList<GetSubTypes.SubTypesDto>>> GetSubTypes(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetSubTypes.Query(), ct);
            return Ok(result);
        }

        // GET /api/lookups/estApptstatuses
        [HttpGet("estApptStatuses")]
        public async Task<ActionResult<IReadOnlyList<GetEstApptStatuses.EstApptStatusesDto>>> GetEstApptStatuses(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetEstApptStatuses.Query(), ct);
            return Ok(result);
        }

        // GET /api/lookups/quoteStatuses
        [HttpGet("quoteStatuses")]
        public async Task<ActionResult<IReadOnlyList<GetQuoteStatuses.QuoteStatusesDto>>> GetQuoteStatuses(CancellationToken ct)
        {
            var result = await Mediator.Send(new GetQuoteStatuses.Query(), ct);
            return Ok(result);
        }

    }

}