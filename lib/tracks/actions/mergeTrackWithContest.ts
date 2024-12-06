import { ContestTrack } from "@/domain/ContestTrack.schema";
import { Track } from "@/domain/Track.schema";

/**
 * Merges the track with the specified contest.
 * @param track - The track to merge with the contest.
 * @param contestId - The ID of the contest to merge with the track.
 * @returns The track with the associated contest added to its contests array.
 */
export const mergeTrackWithContest = (track: any, contestId: number): Track => {
  const contestTrack = track?.contestTracks.find((contestTrack: ContestTrack) => contestTrack.contestId === contestId) || undefined;
  const result = {
    ...track,
    contests: [contestTrack?.contest],
  };
  return result;
}