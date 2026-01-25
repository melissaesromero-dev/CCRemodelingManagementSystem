using Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    public class SampleDataSeeder
    {
        //Add demo data
        public static async Task SeedDataAsync(CCRemodelDbContext context)
        {
            #region HELPER FUNCTIONS TO GET DATA FOR PUPULATION
            //Get Customer by customer Num
            static async Task<Customer> GetCustomerByCustNum(int custNum, CCRemodelDbContext context)
            {
                var customer = await context.Customers
                               .Where(c => custNum == c.CustNum)
                               .FirstOrDefaultAsync() ?? throw new InvalidOperationException("Seeded customer by CustNum not found.");

                return customer;
            }
            ;

            //Get Customer by Customer ID
            static async Task<Customer> GetCustomerByCustId(string custId, CCRemodelDbContext context)
            {
                var customer = await context.Customers
                               .Where(c => custId == c.Id)
                               .FirstOrDefaultAsync() ?? throw new InvalidOperationException("Seeded customer by Id not found.");

                return customer;
            }
            ;

            //Get User
            static async Task<User> GetUserByUserName(string userName, CCRemodelDbContext context)
            {
                var user = await context.Users
                    .FirstOrDefaultAsync(u => u.UserName == userName)
                    ?? throw new InvalidOperationException($"Seeded user '{userName}' not found.");

                return user;
            }
    ;

            //Get Service Main Type
            static async Task<ServiceMainType> GetServiceMainType(int mainTypeId, CCRemodelDbContext context)
            {
                var mainType = await context.ServiceMainTypes
                               .Where(s => mainTypeId == s.Id)
                               .FirstOrDefaultAsync() ?? throw new InvalidOperationException("Seeded main type not found.");

                return mainType;
            }
            ;

            //Get Service Sub Type
            static async Task<ServiceSubType> GetServiceSubType(int subTypeId, CCRemodelDbContext context)
            {
                var subType = await context.ServiceSubTypes
                               .Where(s => subTypeId == s.Id)
                               .FirstOrDefaultAsync() ?? throw new InvalidOperationException("Seeded sub type not found.");

                return subType;
            }
            ;

            //Get Service Request by ReqNum
            static async Task<ServiceRequest> GetServiceRequest(int reqNum, CCRemodelDbContext context)
            {
                var serviceRequest = await context.ServiceRequests
                               .Where(sr => reqNum == sr.ReqNum)
                               .FirstOrDefaultAsync() ?? throw new InvalidOperationException("Seeded service request not found.");

                return serviceRequest;
            }
            ;

            //Get List of Requests by CustomerId
            static async Task<ServiceRequest[]> GetServiceRequestByCustomerId(string custId, CCRemodelDbContext context)
            {
                var serviceRequestsByCustId = await context.ServiceRequests
                               .Where(sr => custId == sr.Id)
                               .ToArrayAsync();

                return serviceRequestsByCustId;
            }
            ;

            //Get Appointments by customerId
            static async Task<EstimateAppointment[]> GetEstimateApptsByCustId(string custId, CCRemodelDbContext context)
            {
                var estimateAppointments = await context.EstimateAppointments
                    .Join(context.ServiceRequests,
                        ea => ea.ServiceRequestId,
                        sr => sr.Id,
                        (ea, sr) => new { ea, sr })
                    .Join(context.Customers,
                        x => x.sr.CustomerId,
                        c => c.Id,
                        (x, c) => new { x.ea, c })
                    .Where(x => x.c.Id == custId)
                    .Select(x => x.ea)
                    .AsNoTracking()
                    .ToArrayAsync();


                return estimateAppointments;
            }
            ;

            //Get Quotes by customerId
            static async Task<Quote[]> GetQuotesByCustId(string custId, CCRemodelDbContext context)
            {
                var quotes = await context.Quotes
                    .Join(context.ServiceRequests,
                        q => q.ServiceRequestId,
                        sr => sr.Id,
                        (q, sr) => new { q, sr })
                    .Join(context.Customers,
                        x => x.sr.CustomerId,
                        c => c.Id,
                        (x, c) => new { x.q, c })
                    .Where(x => x.c.Id == custId)
                    .Select(x => x.q)
                    .AsNoTracking()
                    .ToArrayAsync();


                return quotes;
            }
            ;

            #endregion

            #region ADD SEED/DEMO CUSTOMERS     

            //Add 10 Customers
            if (!await context.Customers.AnyAsync(c => c.IsSampleData))
            {
                var customers = new List<Customer>
            {
                new()
                {
                    CustNum = 10009999,
                    FirstName = "Ava",
                    LastName = "Martinez",
                    Email = "ava.martinez@example.com",
                    Phone = "(410) 555-0101",
                    Address = "123 Maple St",
                    City = "Baltimore",
                    StateId = 38,
                    Zip = "21201",
                    ContactMethod = PreferredContactMethod.Email,
                    BestTime = BestTime.Noon,
                    StatusId = CustomerStatus.Active,
                    IsSampleData = true,
                    CreationDate = DateTime.Today.Date
                },
                new()
                {
                    CustNum = 10019999,
                    FirstName = "Liam",
                    LastName = "Nguyen",
                    Email = "liam.nguyen@example.com",
                    Phone = "(443) 555-0102",
                    Address = "48 Harbor View Dr",
                    City = "Baltimore",
                    StateId = 38,
                    Zip = "21230",
                    StatusId = CustomerStatus.Active,
                    IsSampleData = true,
                    CreationDate = DateTime.Today.Date
                },
                new()
                {
                    CustNum = 10029999,
                    FirstName = "Noah",
                    LastName = "Johnson",
                    Email = "noah.johnson@example.com",
                    Phone = "(202) 555-0103",
                    Address = "901 Pine Ridge Rd",
                    City = "Washington",
                    StateId = 38,
                    Zip = "20001",
                    StatusId = CustomerStatus.Active,
                    IsSampleData = true,
                    CreationDate = DateTime.Today.Date
                },
                new()
                {
                    CustNum = 10039999,
                    FirstName = "Emma",
                    LastName = "Thompson",
                    Email = "emma.thompson@example.com",
                    Phone = "(703) 555-0104",
                    Address = "77 Cedar Ct",
                    City = "Alexandria",
                    StateId = 38,
                    Zip = "22314",
                    StatusId = CustomerStatus.Active,
                    IsSampleData = true,
                    CreationDate = DateTime.Today.Date
                },
                new()
                {
                    CustNum = 10049999,
                    FirstName = "Olivia",
                    LastName = "Davis",
                    Email = "olivia.davis@example.com",
                    Phone = "(301) 555-0105",
                    Address = "15 Brookside Ave",
                    City = "Rockville",
                    StateId = 38,
                    Zip = "20850",
                    StatusId = CustomerStatus.Active,
                    IsSampleData = true,
                    CreationDate = DateTime.Today.Date
                },
                new()
                {
                    CustNum = 10059999,
                    FirstName = "Mason",
                    LastName = "Hernandez",
                    Email = "mason.hernandez@example.com",
                    Phone = "(410) 555-0106",
                    Address = "200 Oak Hollow Ln",
                    City = "Towson",
                    StateId = 38,
                    Zip = "21286",
                    StatusId = CustomerStatus.Active,
                    IsSampleData = true, 
                    CreationDate = DateTime.Today.Date
                },
                new()
                {
                    CustNum = 10069999,
                    FirstName = "Isabella",
                    LastName = "Wilson",
                    Email = "isabella.wilson@example.com",
                    Phone = "(443) 555-0107",
                    Address = "560 Sunflower Dr",
                    City = "Columbia",
                    StateId = 38,
                    Zip = "21044",
                    StatusId = CustomerStatus.Archived,
                    IsSampleData = true, 
                    CreationDate = DateTime.Today.Date
                },
                new()
                {
                    CustNum = 10079999,
                    FirstName = "Sophia",
                    LastName = "Brown",
                    Email = "sophia.brown@example.com",
                    Phone = "(202) 555-0108",
                    Address = "9 Willow Glen Pl",
                    City = "Washington",
                    StateId = 38,
                    Zip = "20002",
                    StatusId = CustomerStatus.Active,
                    IsSampleData = true, 
                    CreationDate = DateTime.Today.Date
                },
                new()
                {
                    CustNum = 10089999,
                    FirstName = "Elijah",
                    LastName = "Garcia",
                    Email = "elijah.garcia@example.com",
                    Phone = "(301) 555-0109",
                    Address = "480 Lakeview Blvd",
                    City = "Gaithersburg",
                    StateId = 38,
                    Zip = "20877",
                    ContactMethod = PreferredContactMethod.Email,
                    StatusId = CustomerStatus.Active,
                    IsSampleData = true, 
                    CreationDate = DateTime.Today.Date
                },
                new()
                {
                    CustNum = 10099999,
                    FirstName = "Mia",
                    LastName = "Anderson",
                    Email = "mia.anderson@example.com",
                    Phone = "(703) 555-0110",
                    Address = "33 Ridgecrest Way",
                    City = "Arlington",
                    StateId = 51,
                    Zip = "22201",
                    StatusId = CustomerStatus.Active,
                    IsSampleData = true,
                    CreationDate = DateTime.Today.Date
                }

            };

                context.Customers.AddRange(customers);
                await context.SaveChangesAsync();
            }
            ;


            #endregion

            #region ADD SEED/DEMO SERVICE REQUESTS
            // Add 4 Service Requests
            //Set customer IDs
            var cust1 = await GetCustomerByCustNum(10009999, context);
            var cust2 = await GetCustomerByCustNum(10039999, context);
            var cust3 = await GetCustomerByCustNum(10059999, context);
            var cust4 = await GetCustomerByCustNum(10079999, context);

            var stateID = await context.States
                                .Where(s => s.ShortName == "PA")
                                .Select(s => s.Id)
                                .FirstOrDefaultAsync();

            var staff1 = await GetUserByUserName("admin1@example.com", context);
            var staff2 = await GetUserByUserName("staff1@example.com", context);

            if (!await context.ServiceRequests.AnyAsync(sr => sr.IsSampleData))
            {
                var serviceRequests = new List<ServiceRequest>
            {
                new()
                {
                    ReqNum = 20009999,
                    CustomerId = cust1.Id,
                    UserId = staff1.Id, // Admin
                    MainServiceTypeId = 1,   // Remodel
                    SubServiceTypeId = 1,    // Kitchen
                    ServiceDesc = "Full kitchen remodel including new cabinets, countertops, and flooring.",
                    ServiceAddress = "123 Maple St",
                    ServiceCity = "Baltimore",
                    ServiceStateId = stateID,
                    ServiceZip = "21201",
                    BudgetRangeId = 1, //$100-$500
                    DesiredStartDate = DateTime.Today.AddDays(30),
                    StatusId = 1, // submitted
                    IsSampleData = true,
                    CreationDate = DateTime.Today,
                    CustFullName = cust1.FullName,
                    StaffFullName = staff1.FirstName + " " + staff1.LastName,
                    MainServiceTypeDesc =(await GetServiceMainType(1, context)).Description,
                    SubServiceTypeDesc = (await GetServiceSubType(1, context)).Description
                },
                new()
                {
                    ReqNum = 20019999,
                    CustomerId = cust1.Id,
                    UserId = staff2.Id, // staff
                    MainServiceTypeId = 1,   // Remodel
                    SubServiceTypeId = 3,    // Basement
                    ServiceDesc = "Basement finishing with drywall, flooring, and electrical setup.",
                    ServiceAddress = "901 Pine Ridge Rd",
                    ServiceCity = "Washington",
                    ServiceStateId = stateID,
                    ServiceZip = "20001",
                    BudgetRangeId = 6, //$10,000-$20,000
                    DesiredStartDate = DateTime.Today.AddDays(45),
                    StatusId = 2, // estimate sent
                    IsSampleData = true,
                    CreationDate = DateTime.Today,
                    CustFullName = cust1.FullName,
                    StaffFullName = staff2.FirstName + " " + staff1.LastName,
                    MainServiceTypeDesc =(await GetServiceMainType(1, context)).Description,
                    SubServiceTypeDesc = (await GetServiceSubType(3, context)).Description
                },
                new()
                {
                    ReqNum = 20029999,
                    CustomerId = cust2.Id,
                    UserId = staff1.Id, // Admin
                    MainServiceTypeId = 4,   // Repair
                    SubServiceTypeId = 11,   // General Repairs
                    ServiceDesc = "Repair water damage and repaint drywall in living room.",
                    ServiceAddress = "15 Brookside Ave",
                    ServiceCity = "Rockville",
                    ServiceStateId = stateID,
                    ServiceZip = "20850",
                    BudgetRangeId = 8, //$35,000-$50,000
                    DesiredStartDate = DateTime.Today.AddDays(10),
                    StatusId = 3, // customer accepted/approved
                    IsSampleData = true,
                    CreationDate = DateTime.Today,
                    CustFullName = cust1.FullName,
                    StaffFullName = staff1.FirstName + " " + staff1.LastName,
                    MainServiceTypeDesc =(await GetServiceMainType(4, context)).Description,
                    SubServiceTypeDesc = (await GetServiceSubType(11, context)).Description
                },
                new()
                {
                    ReqNum = 20039999,
                    CustomerId = cust3.Id,
                    UserId = staff2.Id, // staff
                    MainServiceTypeId = 2,   // ExteriorOutdoor
                    SubServiceTypeId = 4,    // Deck
                    ServiceDesc = "Build new composite deck with railing and stairs.",
                    ServiceAddress = "9 Willow Glen Pl",
                    ServiceCity = "Washington",
                    ServiceStateId = stateID,
                    ServiceZip = "20002",
                    BudgetRangeId = 9, //$50,000-$75,000
                    DesiredStartDate = DateTime.Today.AddDays(60),
                    StatusId = 1, // submitted
                    IsSampleData = true,
                    CreationDate = DateTime.Today,
                    CustFullName = cust1.FullName,
                    StaffFullName = staff2.FirstName + " " + staff2.LastName,
                    MainServiceTypeDesc =(await GetServiceMainType(2, context)).Description,
                    SubServiceTypeDesc = (await GetServiceSubType(4, context)).Description
                }
            };

                context.ServiceRequests.AddRange(serviceRequests);
                await context.SaveChangesAsync();


                //add request reference to approprite customers
                //cust1.OpenRequests = await GetServiceRequestByCustomerId(cust1.Id, context);
                //cust2.OpenRequests = await GetServiceRequestByCustomerId(cust2.Id, context);
                //cust3.OpenRequests = await GetServiceRequestByCustomerId(cust3.Id, context);
            }
            ;

            #endregion

            #region ADD SEED/DEMO ESTIMATE APPOINTMENT
            // Add 4 Estimate Appointments
            //Set service request IDs

            var serviceReq1 = await GetServiceRequest(20009999, context);
            var serviceReq2 = await GetServiceRequest(20019999, context);
            var serviceReq3 = await GetServiceRequest(20029999, context);
            var serviceReq4 = await GetServiceRequest(20039999, context);

            if (!await context.EstimateAppointments.AnyAsync(ea => ea.IsSampleData))
            {
                var estimateAppointments = new List<EstimateAppointment>
            {
                new()
                {
                    EstApptNum = 30009999,
                    ServiceRequestId = serviceReq1.Id,
                    ScheduledDate    = DateTime.Today.AddDays(1),
                    ScheduledTime    = TimeSpan.FromHours(9),
                    Notes            = "Testing testing testing testing.",
                    StatusId         = 1, // scheduled
                    IsSampleData = true,
                    CreationDate     = DateTime.Today,
                    RequestNumber    = serviceReq1.ReqNum,
                    CustFullName     = serviceReq1.CustFullName,
                    StaffFullName    = serviceReq1.StaffFullName
                },
                new()
                {
                    EstApptNum       = 30019999,
                    ServiceRequestId = serviceReq2.Id,
                    StatusId         = 1, // scheduled                    
                    ScheduledDate    = DateTime.Today.AddDays(-5),
                    ScheduledTime    = TimeSpan.FromHours(10),
                    IsSampleData = true,
                    CreationDate     = DateTime.Today,
                    RequestNumber    = serviceReq2.ReqNum,
                    CustFullName     = serviceReq2.CustFullName,
                    StaffFullName    = serviceReq2.StaffFullName
                },
                new()
                {
                    EstApptNum       = 30029999,
                    ServiceRequestId = serviceReq3.Id,
                    ScheduledDate    = DateTime.Today.AddDays(3),
                    ScheduledTime    = TimeSpan.FromHours(14),
                    StatusId         = 2, // completed
                    IsSampleData = true,
                    CreationDate     = DateTime.Today,
                    RequestNumber    = serviceReq3.ReqNum,
                    CustFullName     = serviceReq3.CustFullName,
                    StaffFullName    = serviceReq3.StaffFullName
                },
                new()
                {
                    EstApptNum       = 30039999,
                    ServiceRequestId = serviceReq4.Id,
                    ScheduledDate    = DateTime.Today.AddDays(5),
                    ScheduledTime    = TimeSpan.FromHours(10),
                    StatusId         = 3, //cancelled
                    Notes            = "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum ",
                    IsSampleData = true,
                    CreationDate     = DateTime.Today,
                    RequestNumber    = serviceReq4.ReqNum,
                    CustFullName     = serviceReq4.CustFullName,
                    StaffFullName    = serviceReq4.StaffFullName
                }
            };

                context.EstimateAppointments.AddRange(estimateAppointments);
                await context.SaveChangesAsync();

                //build list of unique customerIds from the requests
                //var custIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                //custIds.Add(serviceReq1.CustomerId);
                //custIds.Add(serviceReq2.CustomerId);
                //custIds.Add(serviceReq3.CustomerId);
                //custIds.Add(serviceReq4.CustomerId);

                //add appointment reference to approprite customers
                //foreach (var id in custIds)
                //{
                //    var cust = await GetCustomerByCustId(id, context);
                //    cust.EstAppts = await GetEstimateApptsByCustId(id, context);
                //}
            }
            ;

            #endregion

            #region ADD SEED/DEMO QUOTES
            // Add 3 Quotes
            if (!await context.Quotes.AnyAsync(q => q.IsSampleData))
            {
                var quotes = new List<Quote>
            {
                new()
                {
                    QuoteNum = 1009999,
                    ServiceRequestId = serviceReq1.Id,
                    StatusId = 1,
                    MaterialDetails = "PVC pipe (20ft), 2x elbows, sealant",
                    MaterialCostEstimate = 185.25m,
                    LaborDetails = "2 hrs plumber + 0.5 hr helper",
                    LaborCostEstimate = 210.00m,
                    IsSampleData = true,
                    CreationDate = DateTime.Today,
                    RequestNumber = serviceReq1.ReqNum,
                    ServiceMainTypeDesc = serviceReq1.MainServiceTypeDesc,
                    ServiceSubTypeDesc  = serviceReq1.SubServiceTypeDesc
                },
                new()
                {
                    QuoteNum = 2009999,
                    ServiceRequestId = serviceReq2.Id,
                    StatusId = 2,
                    MaterialDetails = "12x24 ceramic tile (60 sq ft), thinset, grout",
                    MaterialCostEstimate = 640.00m,
                    LaborDetails = "Tile demo + install, 8 hrs",
                    LaborCostEstimate = 920.00m,
                    IsSampleData = true,
                    CreationDate     = DateTime.Today,
                    RequestNumber = serviceReq2.ReqNum,
                    ServiceMainTypeDesc = serviceReq2.MainServiceTypeDesc,
                    ServiceSubTypeDesc  = serviceReq2.SubServiceTypeDesc
                },
                new()
                {
                    QuoteNum = 3009999,
                    ServiceRequestId = serviceReq4.Id,
                    StatusId = 1,
                    MaterialDetails = "Deck stain (3 gal), sandpaper, brushes",
                    MaterialCostEstimate = 155.49m,
                    LaborDetails = "Surface prep + stain, 6 hrs",
                    LaborCostEstimate = 540.00m,
                    IsSampleData = true,
                    CreationDate     = DateTime.Today,
                    RequestNumber = serviceReq4.ReqNum,
                    ServiceMainTypeDesc = serviceReq4.MainServiceTypeDesc,
                    ServiceSubTypeDesc  = serviceReq4.SubServiceTypeDesc
                }
            };

                context.Quotes.AddRange(quotes);
                await context.SaveChangesAsync();

                //build list of unique customerIds from the requests
                //var custIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                //custIds.Add(serviceReq1.CustomerId);
                //custIds.Add(serviceReq2.CustomerId);
                //custIds.Add(serviceReq4.CustomerId);

                //add quote reference to approprite customers
                //foreach (var id in custIds)
                //{
                //    var cust = await GetCustomerByCustId(id, context);
                //    cust.Quotes = await GetQuotesByCustId(id, context);
                //}
            }
            ;

            #endregion



        }
    }
}
