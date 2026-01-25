using System;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(Description), IsUnique = true)]
public class ServiceMainType
{
    public int Id { get; set; }

    public required string Description { get; set; } = default!; // Remodel, ExteriorOutdoor, Custom, Repair, Other

}
