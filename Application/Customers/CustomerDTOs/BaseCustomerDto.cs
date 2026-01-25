using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Customers.CustomerDTOs
{
    public class BaseCustomerDto
    {
        public int CustNum { get; set; }

        public string FirstName { get; set; } = "";

        public string LastName { get; set; } = "";

        public string Email { get; set; } = "";

        public string Phone { get; set; } = "";

        public string? Address { get; set; }

        public string City { get; set; } = "";

        public int StateId { get; set; }

        public string? Zip { get; set; }

        public PreferredContactMethod ContactMethod { get; set; } = PreferredContactMethod.Any;

        public CustomerStatus StatusId { get; set; } = CustomerStatus.Active;

        public BestTime BestTime { get; set; } = BestTime.Any;

        public DateTime CreationDate { get; set; }
    }
}
