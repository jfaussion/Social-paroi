import { Track } from "@/domain/Track.schema";

/**
 * Merges the track with the user progress.
 * @param track - The track to merge.
 * @param numOfDone - The number of users who have completed the track.
 * @returns The track with the user progress.
 */
export const mergeTrackWithProgress = (track: any, numOfDone?: number): Track => {
  const userProgress = track.trackProgress[0] || undefined;
  const result = {
    ...track,
    trackProgress: { ...userProgress },
    countDone: numOfDone ?? 0,
  };
  return result;
}