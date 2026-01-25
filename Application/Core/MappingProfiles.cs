using Application.Customers.CustomerDTOs;
using Application.EstimateAppointments.EstimateApptDTOs;
using Application.Quotes.QuoteDTOs;
using Application.ServiceRequests.ServiceReqDTOs;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Customer, Customer>();
            CreateMap<CreateCustomerDto, Customer>();
            CreateMap<EditCustomerDto, Customer>();


            CreateMap<ServiceRequest, ServiceRequest>();
            CreateMap<CreateServiceReqDto, ServiceRequest>();
            CreateMap<EditServiceReqDto, ServiceRequest>();


            CreateMap<EstimateAppointment, EstimateAppointment>();
            CreateMap<CreateEstimateApptDto, EstimateAppointment>();
            CreateMap<EditEstimateApptDto, EstimateAppointment>();


            CreateMap<Quote, Quote>();
            CreateMap<CreateQuoteDto, Quote>();
            CreateMap<EditQuoteDto, Quote>();

        }
    }
}
