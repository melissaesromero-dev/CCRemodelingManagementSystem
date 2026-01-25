import { z } from "zod";

const requiredString = (fieldName: string) =>
  z
    .string({ required_error: `${fieldName} is Required` })
    .trim()
    .min(1, `${fieldName} is Required`);

const COMPLETE_STATUS_ID = 2;
const CANCELLED_STATUS_ID = 3;
const MISSED_STATUS_ID = 4;

export const estimateApptSchema = z
  .object({
    statusId: z.coerce.number().int().default(1),

    serviceRequestId: requiredString("Service request"),

    scheduledDate: requiredString("Date is required"),

    scheduledTime: requiredString("Appointment time"),

    notes: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    const { statusId, scheduledDate, scheduledTime } = data;

    const d = new Date(scheduledDate);
    if (Number.isNaN(d.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledDate"],
        message: "Invalid date",
      });
      return;
    }

    const [h, m, s] = (scheduledTime ?? "00:00:00").split(":").map(Number);
    const scheduled = new Date(d);
    scheduled.setHours(h || 0, m || 0, s || 0, 0);

    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const max = new Date(today);
    max.setFullYear(max.getFullYear() + 2);
    max.setHours(0, 0, 0, 0);

    // If Missed + future date/time-error
    if (statusId === MISSED_STATUS_ID && scheduled > now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["statusId"],
        message:
          'You cannot select a status of "missed" for an appointment with a future time and/or date',
      });
      return;
    }

    // If Complete or Cancelled- skip future-date/time requirement
    if (statusId === COMPLETE_STATUS_ID || statusId === CANCELLED_STATUS_ID)
      return;

    // For scheduled: scheduled must be in next 2 years AND in the future
    if (!(scheduled > now && scheduled < max)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledDate"],
        message: "Appointment date must be in the future and within 2 years",
      });
    }
  });

export type EstimateApptSchema = z.infer<typeof estimateApptSchema>;
