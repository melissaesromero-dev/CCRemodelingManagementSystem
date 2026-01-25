using Application.PublicQuote.PublicQuoteDTOs;
using AutoMapper;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.PublicQuote.Mapping
{
    public class PublicQuoteMappingProfile : Profile
    {
        public PublicQuoteMappingProfile() 
        {
            // ============================
            // DTO → Customer
            // ============================
            CreateMap<SubmitQuoteRequestDto, Customer>()
                // server / DB controlled
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.CustNum, opt => opt.Ignore())
                .ForMember(d => d.CreationDate, opt => opt.Ignore())
                .ForMember(d => d.StatusId, opt => opt.Ignore())

                // NotMapped
                .ForMember(d => d.OpenRequests, opt => opt.Ignore())
                .ForMember(d => d.OpenRequestsCount, opt => opt.Ignore())
                .ForMember(d => d.EstAppts, opt => opt.Ignore())
                .ForMember(d => d.EstApptDates, opt => opt.Ignore())
                .ForMember(d => d.EstApptsCount, opt => opt.Ignore())
                .ForMember(d => d.Quotes, opt => opt.Ignore())
                .ForMember(d => d.QuotesCount, opt => opt.Ignore())

                // hygiene
                .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.FirstName.Trim()))
                .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.LastName.Trim()))
                .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email.Trim()))
                .ForMember(d => d.Phone, opt => opt.MapFrom(s => s.Phone.Trim()))
                .ForMember(d => d.City, opt => opt.MapFrom(s => s.City.Trim()))
                .ForMember(d => d.Address, opt => opt.MapFrom(s => s.Address != null ? s.Address.Trim() : null))
                .ForMember(d => d.Zip, opt => opt.MapFrom(s => s.Zip != null ? s.Zip.Trim() : null))
                .ForMember(d => d.ContactMethod, opt => opt.MapFrom(s => s.ContactMethod))
                .ForMember(d => d.BestTime, opt => opt.MapFrom(s => s.BestTime));

            // ============================
            // DTO → ServiceRequest
            // ============================
            CreateMap<SubmitQuoteRequestDto, ServiceRequest>()
                // server / DB controlled
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.ReqNum, opt => opt.Ignore())
                .ForMember(d => d.CustomerId, opt => opt.Ignore())
                .ForMember(d => d.UserId, opt => opt.Ignore())
                .ForMember(d => d.SubServiceTypeId, opt => opt.Ignore())
                .ForMember(d => d.StatusId, opt => opt.Ignore())
                .ForMember(d => d.CreationDate, opt => opt.Ignore())

                // NotMapped
                .ForMember(d => d.CustFullName, opt => opt.Ignore())
                .ForMember(d => d.StaffFullName, opt => opt.Ignore())
                .ForMember(d => d.MainServiceTypeDesc, opt => opt.Ignore())
                .ForMember(d => d.SubServiceTypeDesc, opt => opt.Ignore())
                .ForMember(d => d.EstApptStatus, opt => opt.Ignore())
                .ForMember(d => d.QuoteNum, opt => opt.Ignore())

                // hygiene
                .ForMember(d => d.ServiceDesc, opt => opt.MapFrom(s => (s.ServiceDesc ?? string.Empty).Trim()))
                .ForMember(d => d.ServiceCity, opt => opt.MapFrom(s => (s.ServiceCity ?? string.Empty).Trim()))
                .ForMember(d => d.ServiceAddress, opt => opt.MapFrom(s => s.ServiceAddress != null ? s.ServiceAddress.Trim() : null))
                .ForMember(d => d.ServiceZip, opt => opt.MapFrom(s => s.ServiceZip != null ? s.ServiceZip.Trim() : null))
                .ForMember(d => d.MainServiceTypeId, opt => opt.MapFrom(s => s.MainServiceTypeId))
                .ForMember(d => d.ServiceStateId, opt => opt.MapFrom(s => s.ServiceStateId))
                .ForMember(d => d.BudgetRangeId, opt => opt.MapFrom(s => s.BudgetRangeId))
                .ForMember(d => d.DesiredStartDate, opt => opt.MapFrom(s => s.DesiredStartDate));
        }
    }
}
