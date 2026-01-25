using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain;

public class User : IdentityUser
{
    [SetsRequiredMembers]               
    public User()
    {
        FirstName = string.Empty;
        LastName = string.Empty;
    }

    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    // FK
    public int UserTypeId { get; set; }

    public DateTime CreationDate { get; set; } = DateTime.UtcNow;

    [NotMapped]
    public string FullName => $"{LastName}, {FirstName}";

}
