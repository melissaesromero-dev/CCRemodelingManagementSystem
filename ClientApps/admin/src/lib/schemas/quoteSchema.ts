import {z} from 'zod';

const requiredString = (fieldName: string) =>
  z
    .string({ required_error: `${fieldName} is Required` })
    .trim()
    .min(1, `${fieldName} is Required`);

export const quoteSchema = z.object({
    serviceRequestId: requiredString("Service request"),
    statusId: z.coerce.number().int().default(1),
    laborDetails: z.string().optional().default(""),
    materialDetails: z.string().optional().default(""),
    laborCostEstimate: z.coerce.number().default(0),
    materialCostEstimate: z.coerce.number().default(0),
})

export type QuoteSchema = z.infer<typeof quoteSchema>;