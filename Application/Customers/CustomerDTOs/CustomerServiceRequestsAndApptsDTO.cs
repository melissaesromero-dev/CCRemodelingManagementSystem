using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Customers.CustomerDTOs
{
    public class CustomerServiceRequestsAndApptsDTO
    {
        public int ServiceRequestCount { get; set; }
        public int EstimateApptCount { get; set; }

        public int TotalCount => ServiceRequestCount + EstimateApptCount;

        public CustomerServiceRequestsAndApptsDTO(int serviceRequestCount, int estimateApptCount)
        {
            ServiceRequestCount = serviceRequestCount;
            EstimateApptCount = estimateApptCount;
        }
    }

}
