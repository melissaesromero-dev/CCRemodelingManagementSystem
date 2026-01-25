import { z } from "zod";

const requiredString = (fieldName: string) =>
  z
    .string({ required_error: `${fieldName} is required` })
    .trim()
    .min(1, `${fieldName} is required`);

export const contactSchema = z.object({
  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  email: requiredString("Email").email("Email must be valid"),
  subject: requiredString("Subject"),
  message: requiredString("Message").max(4000, "Message is too long"),
});

export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactFormOutput = z.output<typeof contactSchema>;
