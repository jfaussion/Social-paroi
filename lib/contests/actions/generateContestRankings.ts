'use server';

import { PrismaClient } from '@prisma/client/edge';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { ContestStatusEnum } from '@/domain/ContestStatus.enum';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { GenderEnum } from '@/domain/ContestUser.schema';
import { ContestRankingType, ContestRankingTypeEnum } from '@/domain/ContestRankingType.enum';

const prisma = new PrismaClient();

const POINTS_PER_TRACK = 1000;

interface UserScore {
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

async function generateCsvContent(
  userScores: UserScore[],
  contestId: number,
  trackPoints: Map<number, number>
): Promise<string> {
  // Get all contest tracks in order
  const contestTracks = await prisma.contestTrack.findMany({
    where: { contestId },
    include: {
      track: true
    },
    orderBy: {
      id: 'asc'
    }
  });

  // Get all contest activities in order
  const contestActivities = await prisma.contestActivity.findMany({
    where: { contestId },
    orderBy: {
      id: 'asc'
    }
  });

  // Generate headers
  const headers = [
    'Rank',
    'Name',
    'Total Score',
    'Completed Blocks',
    // Add all track names with points
    ...contestTracks.map(ct => {
      const points = trackPoints.get(ct.id) || POINTS_PER_TRACK;
      return `${ct.track.name || `Block ${ct.track.id}`} (${points.toFixed(0)}pts)`;
    }),
    // Add all activity names
    ...contestActivities.map(ca => ca.name)
  ];

  // Generate rows
  const rows = userScores.map((score, index) => {
    // Create maps for quick lookup
    const trackStatusMap = new Map(
      score.trackDetails.map(td => [td.trackId, td.status])
    );
    const activityScoreMap = new Map(
      score.activityDetails.map(ad => [ad.activityId, ad.score])
    );

    return [
      (index + 1).toString(),
      score.name || 'Unknown',
      score.totalScore.toFixed(0),
      score.completedTracks.toString(),
      // Add status for each track (empty string if not DONE)
      ...contestTracks.map(ct => 
        trackStatusMap.get(ct.id) === TrackStatus.DONE ? 'X' : ''
      ),
      // Add score for each activity (0 if not found)
      ...contestActivities.map(ca => activityScoreMap.get(ca.id)?.toString() || '0')
    ];
  });

  // Combine and return
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

async function calculateTrackScores(contestId: number, gender?: string): Promise<Map<number, number>> {
  // Get all tracks and their completion counts
  const trackCompletions = await prisma.contestUserTrack.groupBy({
    by: ['contestTrackId'],
    where: {
      status: TrackStatus.DONE,
      contestUser: gender ? {
        gender: gender
      } : undefined,
      contestTrack: {
        contestId: contestId
      }
    },
    _count: {
      contestTrackId: true
    }
  });

  // Calculate points per track based on completion count
  const trackPoints = new Map<number, number>();
  trackCompletions.forEach(track => {
    trackPoints.set(
      track.contestTrackId,
      POINTS_PER_TRACK / track._count.contestTrackId
    );
  });

  return trackPoints;
}

async function calculateUserScores(contestId: number, trackPoints: Map<number, number>, gender?: string): Promise<UserScore[]> {
  // Get all users and their completed tracks
  const users = await prisma.contestUser.findMany({
    where: {
      contestId,
      gender: gender || undefined
    },
    include: {
      user: true,
      trackResults: {
        include: {
          contestTrack: {
            include: {
              track: true
            }
          }
        }
      },
      activityResults: {
        include: {
          contestActivity: true
        }
      }
    }
  });

  return users.map(user => {
    // Calculate track score and details
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

    // Calculate activity score and details
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

function getRankingGender(type: ContestRankingType): string | undefined {
  if (type === ContestRankingTypeEnum.Enum.Overall) return undefined;
  return type === ContestRankingTypeEnum.Enum.Men ? GenderEnum.Enum.Man : GenderEnum.Enum.Woman;
}

async function generateRanking(tx: any, contestId: number, type: ContestRankingType) {
  const gender = getRankingGender(type);
  
  // Calculate points per track based on completion count
  const trackPoints = await calculateTrackScores(contestId, gender);
  
  // Calculate scores for each user
  const userScores = await calculateUserScores(contestId, trackPoints, gender);
  
  // Sort users by total score
  userScores.sort((a, b) => b.totalScore - a.totalScore);
  
  // Generate CSV content with all tracks and activities
  const csvContent = await generateCsvContent(userScores, contestId, trackPoints);
  
  // Create ranking entry with all details
  return await tx.contestRanking.create({
    data: {
      contestId,
      type,
      csvContent,
      results: {
        create: userScores.map((score, index) => ({
          contestUserId: score.contestUserId,
          rank: index + 1,
          totalScore: score.totalScore,
          trackScore: score.trackScore,
          activityScore: score.activityScore,
          completedTracks: score.completedTracks,
          trackDetails: score.trackDetails,
          activityDetails: score.activityDetails
        }))
      }
    }
  });
}

export async function generateContestRankings(contestId: number) {
  const user = await auth();
  if (!isOpener(user)) {
    throw new Error('Only openers can generate rankings');
  }

  try {
    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Delete any existing rankings for this contest
      await tx.contestRanking.deleteMany({
        where: { contestId }
      });

      // Generate all three rankings
      await generateRanking(tx, contestId, ContestRankingTypeEnum.Enum.Men);
      await generateRanking(tx, contestId, ContestRankingTypeEnum.Enum.Women);
      await generateRanking(tx, contestId, ContestRankingTypeEnum.Enum.Overall);

      // Update contest status to "over"
      await tx.contest.update({
        where: { id: contestId },
        data: { status: ContestStatusEnum.Enum.Over }
      });

      return true;
    });
  } catch (error) {
    console.error('Error generating rankings:', error);
    return false;
  }
} 