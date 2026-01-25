using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.EstimateAppointments.EstimateApptDTOs
{
    public class BaseEstimateApptDto
    {
        public int EstApptNum { get; set; }
        // FKs
        public string? ServiceRequestId { get; set; }
        public int StatusId { get; set; }

        // Schedule
        public DateTime? ScheduledDate { get; set; } // date component used
        public TimeSpan? ScheduledTime { get; set; } // time only

        public DateTime CreationDate { get; set; }
    }
}
