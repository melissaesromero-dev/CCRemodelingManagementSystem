using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Quotes.QuoteDTOs
{
    public class BaseQuoteDto
    {
        public int QuoteNum { get; set; }
        // FK
        public string? ServiceRequestId { get; set; }
        public int StatusId { get; set; }

        // Details
        public string? MaterialDetails { get; set; }
        public decimal MaterialCostEstimate { get; set; }
        public string? LaborDetails { get; set; }
        public decimal LaborCostEstimate { get; set; }
        public decimal TotalCostEstimate { get; set; }

        public DateTime CreationDate { get; set; }
    }
}
