using Application.Reports.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ReportsController : BaseApiController
    {
        // GET: /api/reports/active-quotes-revenue
        [HttpGet("active-quotes-revenue")]
        public async Task<IActionResult> GetActiveQuotesRevenueSummary(
            CancellationToken ct)
        {
            var result = await Mediator.Send(
                new GetActiveQuotesRevenueSummary.Query(), ct);

            return Ok(result);
        }
    }
}
