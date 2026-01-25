using System;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(Description), IsUnique = true)]
public class BudgetRange
{
    public int Id { get; set; }

    public required string Description { get; set; } //"$100 - $500", "$500 - $1,000", "$1,000 - $2,500"
}
