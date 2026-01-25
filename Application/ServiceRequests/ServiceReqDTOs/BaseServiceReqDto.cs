using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ServiceRequests.ServiceReqDTOs
{
    public class BaseServiceReqDto
    {
        public int ReqNum { get; set; }

        // FKs
        public string? CustomerId { get; set; }
        public string? UserId { get; set; }
        public int MainServiceTypeId { get; set; }
        public int SubServiceTypeId { get; set; }

        public string? ServiceDesc { get; set; }

        public string? ServiceAddress { get; set; }

        public string? ServiceCity { get; set; }

        public int ServiceStateId { get; set; }

        public string? ServiceZip { get; set; }

        public int BudgetRangeId { get; set; }

        public DateTime? DesiredStartDate { get; set; }

        public int StatusId { get; set; }

        public DateTime CreationDate { get; set; }
    }
}
