import { z } from 'zod';
import { ContestActivitySchema } from './ContestActivity.schema';
import { ContestUserSchema } from './ContestUser.schema';
import { TrackSchema } from './Track.schema';
import { ContestStatusEnum } from './ContestStatus.enum';

export const ContestSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  date: z.date(),
  coverImage: z.string().nullish(),
  status: ContestStatusEnum,
  activities: z.array(ContestActivitySchema),
  users: z.array(ContestUserSchema),
  tracks: z.array(TrackSchema),
});

export type Contest = z.infer<typeof ContestSchema>;