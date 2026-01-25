using System;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(Description), IsUnique = true)]
public class ServiceRequestStatus
{
    public int Id { get; set; }

    public required string Description { get; set; } 
    // 1 = submitted
    // 2 = estimate sent
    // 3 = customer accepted/approved
    // 4 = in progress
    // 5 = completed
    // 6 = closed/cancelled
}
