import { z } from 'zod';
import { DifficultyEnum } from './Difficulty.enum';
import { HoldColorEnum } from './HoldColor.enum';
import { UserTrackProgressSchema } from './UserTrackProgress.schema';

export const TrackSchema = z.object({
  id: z.number(),
  name: z.string(),
  date: z.date(),
  imageUrl: z.string().optional(),
  holdColor: HoldColorEnum.nullish().transform(val => val ?? 'Unknown').default('Unknown'),
  level: DifficultyEnum.default('Unknown'),
  zone: z.number(),
  points: z.number(),
  trackProgress: UserTrackProgressSchema.optional(),
  removed: z.boolean().default(false),
  countDone: z.number().optional(),
});

export type Track = z.infer<typeof TrackSchema>;





