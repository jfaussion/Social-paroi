'use server';
import { PrismaClient } from '@prisma/client/edge';
import { Filters } from "@/domain/Filters";
import { RemovedEnum } from "@/domain/Removed.enum";
import { Track } from '@/domain/Track.schema';
import { mergeTrackWithContest } from './mergeTrackWithContest';

const prisma = new PrismaClient();

/**
 * Searches for tracks that match the provided filters.
 * @param contestId - The ID of the contest.
 * @param filters - The filters to search by.
 * @returns A Promise that resolves to the tracks that match the provided filters.
 */
export async function searchTrackForContest(contestId: number, filters: Filters): Promise<Track[]> {
  // Initialize an empty array for dynamic AND conditions
  let andConditions = [];
  // If zones are provided and not empty, add zone condition
  if (filters.zones && filters.zones.length > 0) {
    andConditions.push({
      zone: {
        in: filters.zones,
      },
    });
  }
  // If levels are provided and not empty, add level condition
  if (filters.difficulties && filters.difficulties.length > 0) {
    andConditions.push({
      level: {
        in: filters.difficulties,
      },
    });
  }
  // If holdColor is provided and not empty, add holdColor condition
  if (filters.holdColor) {
    andConditions.push({
      holdColor: filters.holdColor,
    });
  }
  // If showRemoved is provided, add removed condition
  if (!filters.showRemoved || filters.showRemoved === RemovedEnum.Enum.NO) {
    // Default to not showing removed tracks
    andConditions.push({
      removed: false,
    });
  } else if (filters.showRemoved === RemovedEnum.Enum.ONLY) {
    andConditions.push({
      removed: true,
    });
  } else {
    // showRemoved === 'YES'
    // No filter needed
  }

  andConditions.push({
    locationId: 1, // TODO: Remove this once we have a real location
  });

  let whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};

  const tracks = await prisma.track.findMany({
    where: whereCondition,
    include: {
      contestTracks: {
        include: {
          contest: true, // Include the contest object linked to ContestTracks
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
  if (tracks) {
    return tracks.map(track => mergeTrackWithContest(track, contestId));
  }
  return [] as Track[];
}