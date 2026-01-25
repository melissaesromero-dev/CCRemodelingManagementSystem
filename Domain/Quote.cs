using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(QuoteNum), IsUnique = true)]
public class Quote
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public int QuoteNum { get; set; }
    // FK
    public required string ServiceRequestId { get; set; }
    public int StatusId { get; set; }

    // Details
    public string? MaterialDetails { get; set; }
    public decimal MaterialCostEstimate { get; set; }
    public string? LaborDetails { get; set; }
    public decimal LaborCostEstimate { get; set; }
    public decimal TotalCostEstimate { get; private set; }
    public bool IsSampleData { get; set; } = false;

    public DateTime CreationDate { get; set; }

    //Properties needed only for display
    [NotMapped]
    public int? RequestNumber { get; set; }

    [NotMapped]
    public string? ServiceMainTypeDesc { get; set; }

    [NotMapped]
    public string? ServiceSubTypeDesc { get; set; }


}
