import { TrackStatus } from '@/domain/TrackStatus.enum';

export const POINTS_PER_TRACK = 1000;

export interface UserScore {
  contestUserId: number;
  name?: string;
  trackScore: number;
  activityScore: number;
  completedTracks: number;
  totalScore: number;
  trackDetails: Array<{
    trackId: number;
    name: string;
    points: number;
    status: string;
  }>;
  activityDetails: Array<{
    activityId: number;
    name: string;
    score: number;
  }>;
}

type TrackCompletion = {
  contestTrackId: number;
  _count: { contestTrackId: number };
};

type TrackResult = {
  contestTrackId: number;
  status: string;
  contestTrack: { track: { id: number; name: string | null } };
};

type ActivityResult = {
  contestActivityId: number;
  score: number;
  contestActivity: { name: string };
};

type ContestUserWithResults = {
  id: number;
  name: string | null;
  user: { name: string | null } | null;
  trackResults: TrackResult[];
  activityResults: ActivityResult[];
};

export function calculateTrackScores(completions: TrackCompletion[]): Map<number, number> {
  const trackPoints = new Map<number, number>();
  completions.forEach(track => {
    trackPoints.set(
      track.contestTrackId,
      POINTS_PER_TRACK / Math.max(1, track._count.contestTrackId)
    );
  });
  return trackPoints;
}

export function calculateUserScores(users: ContestUserWithResults[], trackPoints: Map<number, number>): UserScore[] {
  return users.map(user => {
    let trackScore = 0;
    const trackDetails = user.trackResults.map(tr => {
      const points = trackPoints.get(tr.contestTrackId) || POINTS_PER_TRACK;
      if (tr.status === TrackStatus.DONE) {
        trackScore += points;
      }
      return {
        trackId: tr.contestTrackId,
        name: tr.contestTrack.track.name || `Track_${tr.contestTrack.track.id}`,
        points,
        status: tr.status
      };
    });

    const activityDetails = user.activityResults.map(ar => ({
      activityId: ar.contestActivityId,
      name: ar.contestActivity.name,
      score: ar.score
    }));
    const activityScore = activityDetails.reduce((sum, a) => sum + a.score, 0);

    return {
      contestUserId: user.id,
      name: user.name || user.user?.name || undefined,
      trackScore,
      activityScore,
      completedTracks: trackDetails.filter(td => td.status === TrackStatus.DONE).length,
      totalScore: trackScore + activityScore,
      trackDetails,
      activityDetails
    };
  });
}
