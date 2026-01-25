using Application.EstimateAppointments.Commands;
using Application.EstimateAppointments.EstimateApptDTOs;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.EstimateAppointments.Validators
{
    public class CreateEstimateApptValidator : BaseEstimateApptValidator<CreateEstimateAppt.Command, CreateEstimateApptDto>
    {
        private readonly CCRemodelDbContext _db;

        public CreateEstimateApptValidator(CCRemodelDbContext db) : base(x => x.EstimateApptDto)
        {
            _db = db;

            RuleFor(x => x.EstimateApptDto!.ServiceRequestId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Service Request is required")
                .MustAsync(async (cmd, srId, ct) =>
                    !await _db.EstimateAppointments
                        .AsNoTracking()
                        .AnyAsync(a => a.ServiceRequestId == srId, ct))
                .WithMessage("This service request already has an appointment.");

        }
    }

}
