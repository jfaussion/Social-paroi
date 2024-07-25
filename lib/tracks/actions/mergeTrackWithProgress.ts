import { Track } from "@/domain/Track.schema";

/**
 * Merges the track with the user progress.
 * @param track - The track to merge.
 * @returns The track with the user progress.
 */
export const mergeTrackWithProgress = (track: any): Track => {
  const userProgress = track.trackProgress[0] || undefined;
  const result = {
    ...track,
    trackProgress: { ...userProgress },
  };
  return result;
}