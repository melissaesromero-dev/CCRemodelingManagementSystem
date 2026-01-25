using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(ReqNum), IsUnique = true)]
public class ServiceRequest
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public int ReqNum { get; set; }

    // FKs
    public required string CustomerId { get; set; }
    public string? UserId { get; set; }
    public int MainServiceTypeId { get; set; }
    public int SubServiceTypeId { get; set; }

    [MaxLength(4000)]
    public required string ServiceDesc { get; set; }

    [MaxLength(200)]
    public string? ServiceAddress { get; set; }

    [MaxLength(100)]
    public required string ServiceCity { get; set; }

    public int ServiceStateId { get; set; }

    [MaxLength(20)]
    public string? ServiceZip { get; set; }

    public int BudgetRangeId { get; set; }

    public DateTime? DesiredStartDate { get; set; }

    public int StatusId { get; set; }
    public bool IsSampleData { get; set; } = false;

    public DateTime CreationDate { get; set; }

    //Properties needed only for display
    [NotMapped]
    public string? CustFullName { get; set; }

    [NotMapped]
    public string? StaffFullName { get; set; } = "No Staff Assigned";

    [NotMapped]
    public string? MainServiceTypeDesc { get; set; }

    [NotMapped]
    public string? SubServiceTypeDesc { get; set; }

    [NotMapped]
    public string? EstApptStatus { get; set; }

    [NotMapped]
    public int? QuoteNum { get; set; }

}
