import { z } from 'zod';
import { DifficultyEnum } from './Difficulty.enum';
import { HoldColorEnum } from './HoldColor.enum';
import { UserTrackProgressSchema } from './UserTrackProgress.schema';
import { UserSchema } from './User.schema';

export const TrackSchema = z.object({
  id: z.number(),
  name: z.string(),
  date: z.date(),
  imageUrl: z.string().optional(),
  contests: z.array(z.object({ // redeclare contest schema to avoid circular dependency
    id: z.number(),
    name: z.string(),
    date: z.date(),
    coverImage: z.string().optional(),
  })).optional(),
  holdColor: HoldColorEnum.nullish().transform(val => val ?? 'Unknown').default('Unknown'),
  level: DifficultyEnum.default('Unknown'),
  zone: z.number(),
  points: z.number(),
  trackProgress: UserTrackProgressSchema.optional(),
  removed: z.boolean().default(false),
  usersWhoCompleted: z.array(UserSchema).optional(),
  locationId: z.number().optional(),
});

export type Track = z.infer<typeof TrackSchema>;





