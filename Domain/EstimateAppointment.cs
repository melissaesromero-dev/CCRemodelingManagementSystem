using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(EstApptNum), IsUnique = true)]
[Index(nameof(ServiceRequestId), IsUnique = true)]
public class EstimateAppointment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public int EstApptNum { get; set; }
    // FKs
    public required string ServiceRequestId { get; set; }
    public int StatusId { get; set; }

    // Schedule
    public DateTime? ScheduledDate { get; set; } // date component used
    public TimeSpan? ScheduledTime { get; set; } // time only

    public string? Notes { get; set; }
    public bool IsSampleData { get; set; } = false;

    public DateTime CreationDate { get; set; }

    //Properties needed only for display
    [NotMapped]
    public int? RequestNumber { get; set; }
    
    [NotMapped]
    public string? CustFullName { get; set; }

    [NotMapped]
    public string? StaffFullName { get; set; }

    [NotMapped]
    public DateTime? FullDate =>
             ScheduledDate.HasValue && ScheduledTime.HasValue
             ? ScheduledDate.Value.Date.Add(ScheduledTime.Value)
             : (DateTime?)null;


}
