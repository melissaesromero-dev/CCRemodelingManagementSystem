using System;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(Description), IsUnique = true)]
public class EstimateApptStatus
{
    public int Id { get; set; }

    public required string Description { get; set; }// not scheduled, scheduled, completed, cancelled, missed

}
