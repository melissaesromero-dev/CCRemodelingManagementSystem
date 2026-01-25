using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.PublicQuote.PublicQuoteDTOs
{
    public class SubmitQuoteRequestDto
    {
        // Customer Info
        public string FirstName { get; set; } = "";

        public string LastName { get; set; } = "";

        public string Email { get; set; } = "";

        public string Phone { get; set; } = "";

        public string? Address { get; set; }

        public string City { get; set; } = "";

        public int StateId { get; set; }

        public string? Zip { get; set; }

        public PreferredContactMethod ContactMethod { get; set; } = PreferredContactMethod.Any;

        public BestTime BestTime { get; set; } = BestTime.Any;


        //Service Request Info

        public int MainServiceTypeId { get; set; }
        
        public string ServiceDesc { get; set; }

        public string? ServiceAddress { get; set; }

        public string ServiceCity { get; set; }

        public int ServiceStateId { get; set; }

        public string? ServiceZip { get; set; }

        public int BudgetRangeId { get; set; }

        public DateTime? DesiredStartDate { get; set; }
        
    }
}
