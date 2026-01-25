using Application.EstimateAppointments.EstimateApptDTOs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.EstimateAppointments.Validators
{
    public class BaseEstimateApptValidator<T, TDto> : AbstractValidator<T> where TDto : BaseEstimateApptDto
    {
        private const int StatusComplete = 2;
        private const int StatusCancelled = 3;
        private const int StatusMissed = 4;
        private const int StatusClosed = 5;
        public BaseEstimateApptValidator(Func<T, TDto> selector)
        {
            RuleFor(x => selector(x).ScheduledDate)
                .NotEmpty().WithMessage("Schedule Date is Required")
                .Must((root, date) =>
                {
                    var dto = selector(root);

                    if (dto.StatusId == StatusComplete || dto.StatusId == StatusMissed || dto.StatusId == StatusCancelled || dto.StatusId == StatusClosed)
                        return true;

                    if (!date.HasValue) return false;

                    return date.Value.Date >= DateTime.Today;
                })
                .WithMessage("Date must be today or in the future.");

            RuleFor(x => selector(x).ScheduledTime)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty().WithMessage("Scheduled Time is Required")
                    .Must(t => t is { }
            ts &&
                               ts >= TimeSpan.FromHours(8) &&
                               ts <= TimeSpan.FromHours(19))
                    .WithMessage("Scheduled time must be between 8:00 AM and 7:00 PM.");

            // Ensure combined date+time is in the future (local)
            RuleFor(x => selector(x)).Custom((dto, ctx) =>
            {
                if (!dto.ScheduledDate.HasValue || !dto.ScheduledTime.HasValue) return;

                if (dto.StatusId == StatusComplete || dto.StatusId == StatusCancelled || dto.StatusId == StatusClosed)
                    return;

                var scheduledLocal = dto.ScheduledDate.Value.Date + dto.ScheduledTime.Value;
                if (scheduledLocal <= DateTime.Now)
                {
                    ctx.AddFailure("EstimateApptDto.ScheduledTime", "Scheduled date & time must be in the future.");
                }
            });

            //if status is Missed and date is in the future → error
            RuleFor(x => selector(x)).Custom((dto, ctx) =>
            {
                if (dto.StatusId != StatusMissed)
                    return;

                if (!dto.ScheduledDate.HasValue || !dto.ScheduledTime.HasValue)
                    return;

                var scheduledLocal = dto.ScheduledDate.Value.Date + dto.ScheduledTime.Value;

                if (scheduledLocal > DateTime.Now)
                {
                    ctx.AddFailure(
                        nameof(dto.StatusId),
                        "You cannot select a status of \"missed\" for an appointment with a future date"
                    );
                }
            });
        }
        
    }
}
