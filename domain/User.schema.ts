import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  image: z.string().optional(),
  emailVerified: z.date().optional(),
  role: z.string().optional(),

});

export type User = z.infer<typeof UserSchema>;
