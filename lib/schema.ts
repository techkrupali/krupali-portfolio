import { z } from "zod";
export const contactSchema = z.object({
  n: z.string().trim().min(1, "Name is required"),
  e: z.string().trim().email("Enter a valid email"),
  t: z.string().min(1),
  m: z.string().trim().min(10, "Message needs 10+ characters").max(4000),
});
export type ContactInput = z.infer<typeof contactSchema>;
