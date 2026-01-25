import {z} from 'zod';

const requiredString = (fieldName: string) => z
    .string({required_error: `${fieldName} is Required` })
    .trim()
    .min(1, `${fieldName} is Required`)

export const customerSchema = z.object({
    statusId: z.coerce.number().int().default(1),
    firstName: requiredString('First Name'),
    lastName: requiredString('Last Name'),
    email: requiredString('Email'),
    phone: z.preprocess(
        v => typeof v === "string" ? v.replace(/\D/g, "") : v,
        z.string().length(10, "Phone must be 10 digits")
        ),
    address: requiredString('Address'),
    city: requiredString('City'),
    zip: z.preprocess(v => (v === '' || v == null ? undefined : v),
                  z.string()
                   .regex(/^\d{5}(?:-\d{4})?$/, 'Invalid ZIP')
                   .optional()),
    stateId: z.coerce.number().int().min(1, "State is required"),
    methodId: z
        .preprocess(v => (v === "" || v == null ? undefined : v),
        z.coerce.number().int().min(0) // 1 = "Any"
        )
        .default(0),
    bestTimeId: z
        .preprocess(v => (v === "" || v == null ? undefined : v),
        z.coerce.number().int().min(0) // 1 = "Any"
        )
        .default(0),
})

export type CustomerSchema = z.infer<typeof customerSchema>;