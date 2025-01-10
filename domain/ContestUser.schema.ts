import { z } from "zod";
import { UserSchema } from "./User.schema";

export const GenderEnum = z.enum(['Man', 'Woman']);
export type GenderType = z.infer<typeof GenderEnum>;

export const ContestUserSchema = z.object({
  id: z.number(),
  contestId: z.number(),
  user: UserSchema.nullish(),
  name: z.string().nullish(),
  gender: GenderEnum,
  isTemp: z.boolean().default(false),
});

export type ContestUser = z.infer<typeof ContestUserSchema>;
