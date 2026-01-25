import { z } from "zod";

const requiredString = (fieldName: string) => z
    .string({required_error: `${fieldName} is Required` })
    .trim()
    .min(1, `${fieldName} is Required`)


export const quoteRequestSchema = z.object({

  sameAddress: z.boolean().optional(),
  // Customer
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().min(1, "Email is required").email("Email must be valid"),
  phone: z.string().trim().min(1, "Phone is required"),
  address: z.string().trim().nullable().optional(),
  city: z.string().trim().min(1, "City is required"),
  stateId: z.coerce.number().int().min(1, "State is required"),
  zip: z.string().trim().nullable().optional(),
  contactMethod: z
        .preprocess(v => (v === "" || v == null ? undefined : v),
        z.coerce.number().int().min(0) // 1 = "Any"
        )
        .default(0),
  bestTime: z
        .preprocess(v => (v === "" || v == null ? undefined : v),
        z.coerce.number().int().min(0) // 1 = "Any"
        )
        .default(0),

  // Service Request
  mainServiceTypeId: z.preprocess((v) => {
        if (v === '' || v == null) return undefined;

        const num = typeof v === 'string' ? Number(v) : v;

        if (typeof num !== 'number' || Number.isNaN(num)) {
            return undefined;
        }

        return num;
        },
        z
            .number({
            required_error: "Service main type is required",
            invalid_type_error: "Service main type is required",
            })
            .int()
            .min(1, "Service main type is required")
        ),

  
  serviceDesc: requiredString('Service description'),

  serviceAddress: requiredString('Service Address'),

  serviceCity: requiredString('Service City'),

  serviceZip: z.preprocess(v => (v === '' || v == null ? undefined : v),
                z.string()
                .regex(/^\d{5}(?:-\d{4})?$/, 'Invalid ZIP')
                .optional()),

  serviceStateId: z
      .coerce
      .number()
      .int()
      .min(1, "Service state is required")
      .superRefine((val, ctx) => {
        if (val !== 38) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Currently, we only service Pennsylvania. Please select PA for state.",
          });
        }
      }),

    budgetRangeId: z.coerce.number().int().default(0),

    desiredStartDate: z
      .string()
      .nullable()
      .optional()
      .refine((val) => {
        // not required → empty is OK
        if (!val) return true;

        const d = new Date(val);
        if (Number.isNaN(d.getTime())) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);

        const max = new Date(today);
        max.setFullYear(max.getFullYear() + 2);
        max.setHours(0, 0, 0, 0);

        // strictly future: > today
        return d > today && d < max;
      }, {
        message: "Desired start date must be within the next 2 years",
      })

   
});

export type QuoteRequestFormInput = z.input<typeof quoteRequestSchema>;
export type QuoteRequestFormOutput = z.output<typeof quoteRequestSchema>;

