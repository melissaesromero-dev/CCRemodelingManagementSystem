using System;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(Description), IsUnique = true)]
public class QuoteStatus
{
    public int Id { get; set; }

    public required string Description { get; set; }// draft, sent, accepted, declined

}
