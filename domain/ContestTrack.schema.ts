import { z } from 'zod';
import { ContestSchema } from './Contest.schema';
import { TrackSchema } from './Track.schema';

export const ContestTrackSchema = z.object({
  id: z.number(),
  contestId: z.number(),
  trackId: z.number(),
  contest: ContestSchema.optional(),
  track: TrackSchema.optional(),
});

export type ContestTrack = z.infer<typeof ContestTrackSchema>;


