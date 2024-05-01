import { z } from "zod";
import { TrackStatusEnum } from "./TrackStatus.enum";

export const UserTrackProgressSchema = z.object({
  status: TrackStatusEnum,
  dateCompleted: z.date().optional(),
  updatedAt: z.date().optional(),
  liked: z.boolean().default(false),
});
