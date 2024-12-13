import { z } from "zod";
import { UserSchema } from "./User.schema";

export const ContestUserSchema = z.object({
  id: z.number(),
  contestId: z.number(),
  user: UserSchema.nullish(),
  name: z.string().nullish(),
  gender: z.enum(['Male', 'Female']),
  isTemp: z.boolean().default(false),
});

export type ContestUser = z.infer<typeof ContestUserSchema>;

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}