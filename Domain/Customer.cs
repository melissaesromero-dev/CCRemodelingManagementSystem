using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(CustNum), IsUnique = true)]
[Index(nameof(EmailNormalized), IsUnique = true)]
public class Customer
{
    private string _email = string.Empty;

    //Primary key (GUID)
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public int CustNum { get; set; }

    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    public required string Email { 
        get => _email; 
        set
        {
            _email = value;
            EmailNormalized = value.Trim().ToLowerInvariant();
        } 
    }

    public string? EmailNormalized { get; private set; }

    public required string Phone { get; set; }

    public string? Address { get; set; }

    public required string City { get; set; }

    public int StateId { get; set; }

    public string? Zip { get; set; }

    public PreferredContactMethod ContactMethod { get; set; } = PreferredContactMethod.Any;

    public CustomerStatus StatusId { get; set; } = CustomerStatus.Active;

    public BestTime BestTime { get; set; } = BestTime.Any;
    public bool IsSampleData { get; set; } = false;

    public DateTime CreationDate { get; set; }

    //Properties needed only for display
    [NotMapped]
    public string FullName => $"{LastName}, {FirstName}";

    [NotMapped]
    public List<ServiceRequest>? OpenRequests { get; set; }
    
    [NotMapped]
    public int? OpenRequestsCount { get; set; }

    [NotMapped]
    public List<int>? EstAppts { get; set; }

    [NotMapped]
    public List<DateTime>? EstApptDates { get; set; }

    [NotMapped]
    public int? EstApptsCount { get; set; }

    [NotMapped]
    public List<Quote>? Quotes { get; set; }

    [NotMapped]
    public int? QuotesCount { get; set; }

}

public enum CustomerStatus
{
    Active = 1,
    Archived = 2
}

public enum PreferredContactMethod
{
    [Display(Name = "Any")] Any = 0,
    [Display(Name = "Phone")] Phone = 1,
    [Display(Name = "Email")] Email = 2
}

public enum BestTime
{
    [Display(Name = "Any")] Any = 0,
    [Display(Name = "Morning")] Morning = 1,
    [Display(Name = "Noon")] Noon = 2,
    [Display(Name = "Evening")] Evening = 3
}