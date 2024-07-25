'use server';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

/**
 * Retrieves the user rankings.
 * @returns A Promise that resolves to an array of user rankings.
 */
export async function getUserRankings() {
  const rankings = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      UserTrackProgress: {
        select: {
          track: {
            select: {
              points: true,
            },
            where: {
              removed: false, // Filter out removed tracks
            }
          },
        }
      },
    },
  });

  // Calculate the total score for each user
  const userScores = rankings.map(user => {
    const totalScore = user.UserTrackProgress.reduce((acc, progress) => acc + (progress.track?.points || 0), 0);
    return {
      id: user.id,
      name: user.name,
      image: user.image,
      score: totalScore,
    };
  });

  // Sort users by score in descending order
  userScores.sort((a, b) => b.score - a.score);

  return userScores;
}