using Application.SampleData.Commands;
using Application.SampleData.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SampleDataController : BaseApiController
    {
        [AllowAnonymous]
        //Sample data already loaded?
        [HttpGet("exists")]
        public async Task<IActionResult> HasSampleData()
        {
            var result = await Mediator.Send(new HasSampleData.Query());
            return HandleResult(result);
        }

        //Load Sample Data
        [HttpPost("load")]
        public async Task<IActionResult> LoadSampleData(CancellationToken ct)
        => HandleResult(await Mediator.Send(new LoadSampleData.Command(), ct));

        //Delete Sample Data
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteSampleData(CancellationToken ct)
            => HandleResult(await Mediator.Send(new DeleteSampleData.Command(), ct));
    }
}
