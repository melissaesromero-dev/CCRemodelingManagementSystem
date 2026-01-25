using Application.Customers.Commands;
using Application.Customers.CustomerDTOs;
using Application.Lookups.Queries;
using Application.PublicQuote.Commands;
using Application.PublicQuote.PublicQuoteDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [EnableCors("PublicWeb")]
    [AllowAnonymous]
    [Route("api/public/publicQuote/requestQuote")]
    public class PublicQuoteController : BaseApiController
    {
        // GET api/public/publiQuote/requestQuote
        [HttpPost]
        public async Task<ActionResult<string>> SubmitQuoteRequest(SubmitQuoteRequestDto quoteRequestDto)
        {
            return HandleResult(await Mediator.Send(new SubmitQuoteRequest.Command { RequestQuoteDto = quoteRequestDto }));
        }
                
    }
}



