

using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(ShortName), IsUnique = true)]
public class State
{
    public int Id { get; set; }

    public required string ShortName { get; set; }

    public required string LongName { get; set; }

}
