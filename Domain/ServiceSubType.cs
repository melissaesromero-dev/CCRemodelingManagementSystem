using System;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(Description), IsUnique = true)]
public class ServiceSubType
{
    public int Id { get; set; }

    public int MainTypeId { get; set; }

    public required string Description { get; set; } //Kitchen, Bathroom, Basement, ...
}
