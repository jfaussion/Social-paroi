import { z } from 'zod';
import { UserTrackProgressSchema } from './UserTrackProgress.schema';
import { UserSchema } from './User.schema';
import { ContestUserTrackSchema } from './ContestUserTrack.schema';

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
  holdColorId: z.number().int().nullable().optional(),
  holdColor: z.object({
    id: z.number(),
    name: z.string(),
    color: z.string(),
  }).nullable().optional(),
  points: z.number(),
  // Regular track progress (for non-contest tracks)
  trackProgress: UserTrackProgressSchema.nullable().optional(),
  // Contest-specific progress
  contestProgress: ContestUserTrackSchema.nullable().optional(),
  removed: z.boolean().default(false),
  usersWhoCompleted: z.array(UserSchema).optional(),
  locationId: z.number().optional(),
  difficultyLevelId: z.number().nullable().optional(),
  difficultyLevel: z.object({
    id: z.number(),
    name: z.string(),
    color: z.string().nullable(),
  }).nullable().optional(),
  zoneId: z.number().nullable().optional(),
  zoneRef: z.object({
    id: z.number(),
    name: z.string(),
    miniMapUrl: z.string().nullable(),
  }).nullable().optional(),
});

export type Track = z.infer<typeof TrackSchema>;
