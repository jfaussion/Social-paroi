import { z } from "zod";
import { TrackStatusEnum } from "./TrackStatus.enum";
import { UserSchema } from "./User.schema";

export const UserTrackProgressSchema = z.object({
  status: TrackStatusEnum,
  dateCompleted: z.date().optional(),
  updatedAt: z.date().optional(),
  liked: z.boolean().default(false),
  user: UserSchema.optional(),
});

export type UserTrackProgress = z.infer<typeof UserTrackProgressSchema>;

