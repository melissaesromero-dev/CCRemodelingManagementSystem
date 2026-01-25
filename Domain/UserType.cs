using System;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(Name), IsUnique = true)]
public class UserType
{
    public int Id { get; set; }

    public required string Name { get; set; } // admin, staff, customer, superAdmin

}
