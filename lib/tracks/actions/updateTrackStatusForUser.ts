'use server';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient()

/**
 * Updates the status of a track for a user.
 * 
 * @param trackId - The ID of the track.
 * @param userId - The ID of the user.
 * @param newStatus - The new status of the track for the user.
 * @returns A Promise that resolves to true if the status was updated successfully, or false if an error occurs.
 */
export async function updateTrackStatusForUser(
  trackId: number,
  userId: string,
  newStatus: string, // Assuming 'status' is a string. Adjust the type if necessary.
): Promise<boolean> {
  try {
    await prisma.userTrackProgress.upsert({
      where: {
        user_track_unique_constraint: { // Use the name of the unique constraint
          trackId: trackId,
          userId: userId,
        },
      },
      update: {
        status: newStatus,
      },
      create: {
        userId: userId,
        trackId: trackId,
        status: newStatus,
      },
    });
    return true;
  } catch (err) {
    console.error('Error updating the track for user', err);
    return false;
  }
}