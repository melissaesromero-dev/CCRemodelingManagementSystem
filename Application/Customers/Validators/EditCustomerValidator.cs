using Application.Customers.Commands;
using Application.Customers.CustomerDTOs;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Customers.Validators
{
    public class EditCustomerValidator : BaseCustomerValidator<EditCustomer.Command, EditCustomerDto>
    {
        private readonly CCRemodelDbContext _context;
        public EditCustomerValidator(CCRemodelDbContext context) : base(x => x.CustomerDto)
        {
            _context = context;

            RuleFor(x => x.CustomerDto.Id)
                .NotEmpty().WithMessage("Id is required");

            RuleFor(x => x.CustomerDto)
                .MustAsync(NoOpenWorkForArchivedCustomer)
                .WithMessage("Customer cannot be archived while they have open service requests or incomplete estimate appointments.");
        }

        private async Task<bool> NoOpenWorkForArchivedCustomer(EditCustomerDto dto, CancellationToken ct)
        {
            // Only enforce this when trying to set status to Archived (2)
            const int ServiceRequestCompleted = 5;
            const int ServiceRequestClosed = 6;
            const int EstApptCompleted = 2;

            if (dto.StatusId != CustomerStatus.Archived)
                return true; // rule passes – not archiving

            // Check for any service requests that are NOT completed/closed
            var hasOpenServiceRequests = await _context.ServiceRequests
                .AsNoTracking()
                .AnyAsync(
                    sr =>
                        sr.CustomerId == dto.Id &&
                        sr.StatusId != ServiceRequestCompleted &&
                        sr.StatusId != ServiceRequestClosed,
                    ct);

            if (hasOpenServiceRequests)
                return false;

            // Check for any estimate appts for this customer’s requests that are NOT completed?
            var hasIncompleteAppointments = await _context.EstimateAppointments
                .AsNoTracking()
                .Join(
                    _context.ServiceRequests,
                    ea => ea.ServiceRequestId,
                    sr => sr.Id,
                    (ea, sr) => new { ea, sr }
                )
                .AnyAsync(
                    x =>
                        x.sr.CustomerId == dto.Id &&
                        x.ea.StatusId != EstApptCompleted,
                    ct);

            return !hasIncompleteAppointments;
        }
    }
}
