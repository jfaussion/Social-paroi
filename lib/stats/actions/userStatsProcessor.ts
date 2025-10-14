import { difficultyOrder } from "@/domain/Difficulty.enum";
import { Track } from "@/domain/Track.schema";
import { TrackStats } from "@/domain/TrackStats.schema";
import { createActionLogger } from '@/utils/logger';

const logger = createActionLogger('processTrackStats');

/**
 * Processes the track stats for a user.
 * 
 * @param userTrackProgress - The tracks done by the user.
 * @param totalMountedTracksByDifficulty - The total number of tracks mounted by difficulty.
 * @returns The processed track stats.
 */
export const processTrackStats = (
  userTrackProgress: { track: Track }[], 
  totalMountedTracksByDifficulty: { _count: { _all: number }, level: string }[]
) => {
  logger.start({
    progressCount: userTrackProgress.length,
    mountedGroups: totalMountedTracksByDifficulty.length,
  });
  const stats: Record<string, TrackStats> = {};

  // Initialize stats structure with totalMounted from the second dataset
  totalMountedTracksByDifficulty.forEach(({ level, _count }) => {
    stats[level] = {
      level,
      mountedDone: 0,
      totalDone: 0,
      totalMounted: _count._all,
    };
  });

  // Calculate user-specific stats
  userTrackProgress.forEach(({ track }) => {
    const { level, removed } = track;

    if (!stats[level]) {
      stats[level] = {
        level,
        mountedDone: 0,
        totalDone: 0,
        totalMounted: 0,
      };
    }

    stats[level].totalDone += 1;

    if (!removed) {
      stats[level].mountedDone += 1;
    }
  });

  // Ensure that levels present in userTrackProgress but not in totalMountedTracksByDifficulty are initialized
  Object.keys(stats).forEach(level => {
    if (!stats[level].totalMounted) {
      stats[level].totalMounted = 0;
    }
  });

  const sortedStats = sortTrackStatsByDifficulty(Object.values(stats));
  logger.success({ levelCount: sortedStats.length });
  return sortedStats;
};

const sortTrackStatsByDifficulty: (stats: TrackStats[]) => TrackStats[] = (stats) => {
  return stats.sort((a, b) => {
    return difficultyOrder.indexOf(a.level) - difficultyOrder.indexOf(b.level);
  });
};
