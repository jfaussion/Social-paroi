import { Track } from "@/domain/Track.schema";
import { UserTrackProgress } from "@/domain/UserTrackProgress.schema";

/**
 * Merges the track with the user progress.
 * @param track - The track to merge.
 * @param numOfDone - The number of users who have completed the track.
 * @returns The track with the user progress.
 */
export const mergeTrackWithProgress = (track: any, userId?: string): Track => {
  const userProgress = track?.trackProgress.find((progress: UserTrackProgress) => progress.user?.id === userId) || undefined;
  const result = {
    ...track,
    trackProgress: { ...userProgress },
    usersWhoCompleted: getUsersWhoCompleted(track.trackProgress),
  };
  return result;
}

function getUsersWhoCompleted(trackProgress: any[]) {
  return trackProgress?.map(progress => ({
    id: progress.user.id,
    name: progress.user.name,
    image: progress.user.image,
  }));
}