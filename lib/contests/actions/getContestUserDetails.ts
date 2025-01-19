'use server'
import { PrismaClient } from '@prisma/client/edge';
import { Track } from "@/domain/Track.schema";
import { ContestActivity } from "@/domain/ContestActivity.schema";
import { TrackStatusEnum } from '@/domain/TrackStatus.enum';

const prisma = new PrismaClient();

export interface ContestUserDetails {
  tracks: Track[];
  activities: ContestActivity[];
}

export const getContestUserDetails = async (
  contestId: number,
  contestUserId: number
): Promise<ContestUserDetails> => {
  // Get all tracks for this contest with their completion status for this user
  const contestTracks = await prisma.contestTrack.findMany({
    where: {
      contestId: contestId,
    },
    include: {
      track: true,
      userResults: {
        where: {
          contestUserId: contestUserId,
        },
      },
    },
  });

  // Transform tracks to include completion status
  const tracks = contestTracks.map(contestTrack => ({
    ...contestTrack.track,
    contestProgress: {
      status: contestTrack.userResults[0]?.status || TrackStatusEnum.Enum.TO_DO
    },
  }));

  // Get all activities for this contest with scores for this user
  const contestActivities = await prisma.contestActivity.findMany({
    where: {
      contestId: contestId,
    },
    include: {
      userResults: {
        where: {
          contestUserId: contestUserId,
        },
      },
    },
  });

  // Transform activities to include the user's score directly
  const activities = contestActivities.map(activity => ({
    ...activity,
    userScore: activity.userResults[0]?.score || 0,
    userResults: undefined, // Remove the results array as we've extracted what we need
  }));

  return {
    tracks: tracks as Track[],
    activities: activities as ContestActivity[],
  };
}; 