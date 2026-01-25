using Application.Customers.Commands;
using Application.Customers.CustomerDTOs;
using Application.Quotes.Commands;
using Application.Quotes.Queries;
using Application.Quotes.QuoteDTOs;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class QuoteController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Quote>>> GetQuotesList()
    {
        return await Mediator.Send(new GetQuotesList.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Quote>> GetQuoteDetails(string id)
    {
        return HandleResult(await Mediator.Send(new GetQuoteDetails.Query { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateQuote(CreateQuoteDto quoteDto)
    {
        return HandleResult(await Mediator.Send(new CreateQuote.Command { QuoteDto = quoteDto }));
    }

    [HttpPut]
    public async Task<ActionResult> EditQuote(EditQuoteDto quote)
    {
        return HandleResult(await Mediator.Send(new EditQuote.Command { QuoteDto = quote }));

    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteQuote(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteQuote.Command { Id = id }));

    }

}
