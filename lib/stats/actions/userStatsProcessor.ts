import { TrackStats } from "@/domain/TrackStats.schema";
import { createActionLogger } from '@/utils/logger';

const logger = createActionLogger('processTrackStats');

type DifficultyLevelMeta = {
  name: string;
  color: string | null;
  order: number;
};

type TrackProgressEntry = {
  track: {
    removed: boolean | null;
    difficultyLevel: DifficultyLevelMeta | null;
  } | null;
};

type MountedByDifficulty = {
  difficultyLevel: DifficultyLevelMeta | null;
  _count: { _all: number };
};

export const processTrackStats = (
  userTrackProgress: TrackProgressEntry[],
  totalMountedTracksByDifficulty: MountedByDifficulty[],
) => {
  logger.start({
    progressCount: userTrackProgress.length,
    mountedGroups: totalMountedTracksByDifficulty.length,
  });

  // Key: difficulty name (or 'Unknown' for null)
  const stats: Record<string, TrackStats> = {};
  // Store order alongside for sorting
  const orderMap: Record<string, number> = {};

  totalMountedTracksByDifficulty.forEach(({ difficultyLevel, _count }) => {
    const name = difficultyLevel?.name ?? 'Unknown';
    const order = difficultyLevel?.order ?? Number.MAX_SAFE_INTEGER;
    stats[name] = {
      level: name,
      color: difficultyLevel?.color ?? null,
      mountedDone: 0,
      totalDone: 0,
      totalMounted: _count._all,
    };
    orderMap[name] = order;
  });

  // Calculate user-specific stats
  userTrackProgress.forEach(({ track }) => {
    if (!track) return;
    const name = track.difficultyLevel?.name ?? 'Unknown';
    const order = track.difficultyLevel?.order ?? Number.MAX_SAFE_INTEGER;

    if (!stats[name]) {
      stats[name] = {
        level: name,
        color: track.difficultyLevel?.color ?? null,
        mountedDone: 0,
        totalDone: 0,
        totalMounted: 0,
      };
      orderMap[name] = order;
    }

    stats[name].totalDone += 1;

    if (!track.removed) {
      stats[name].mountedDone += 1;
    }
  });

  const sortedStats = Object.values(stats).sort(
    (a, b) => (orderMap[a.level] ?? Number.MAX_SAFE_INTEGER) - (orderMap[b.level] ?? Number.MAX_SAFE_INTEGER)
  );

  logger.success({ levelCount: sortedStats.length });
  return sortedStats;
};
