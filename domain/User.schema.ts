import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  image: z.string().nullish(),
  emailVerified: z.date().nullable(),
  role: z.string().nullish(),
  contestUsers: z.array(z.object({
    isTemp: z.boolean(),
    contest: z.object({
      id: z.number(),
      name: z.string(),
      date: z.date()
    })
  })).optional()
});

export type User = z.infer<typeof UserSchema>;
