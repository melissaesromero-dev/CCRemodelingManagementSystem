using Application.EstimateAppointments.Commands;
using Application.EstimateAppointments.EstimateApptDTOs;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.EstimateAppointments.Validators
{
    public class EditEstimateApptValidator : BaseEstimateApptValidator<EditEstimateAppt.Command, EditEstimateApptDto>
    {
        private readonly CCRemodelDbContext _db;
        public EditEstimateApptValidator(CCRemodelDbContext db) : base(x => x.EstimateApptDto)
        {
            _db = db;

            RuleFor(x => x.EstimateApptDto.Id)
                .NotEmpty().WithMessage("Id is required");

            RuleFor(x => x.EstimateApptDto!)
            .MustAsync(async (cmd, dto, ct) =>
            {
                if (string.IsNullOrWhiteSpace(dto.ServiceRequestId)) return true; // other rules will catch
                return !await _db.EstimateAppointments
                    .AsNoTracking()
                    .AnyAsync(a => a.ServiceRequestId == dto.ServiceRequestId && a.Id != dto.Id, ct);
            })
            .WithMessage("This service request already has an appointment.");
        }
    }
}
