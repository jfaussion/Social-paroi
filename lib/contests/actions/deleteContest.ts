'use server';
import { Contest } from '@/domain/Contest.schema'; // Adjust the import based on your schema
import { PrismaClient } from '@prisma/client/edge';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary'; // Adjust the import based on your cloudinary utility

const prisma = new PrismaClient();

/**
 * Deletes a contest and its image from the database and Cloudinary.
 * 
 * @param contest - The contest to be deleted.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function callDeleteContest(contest: Contest) {
  const session = await auth();
  if (isOpener(session) === false) {
    throw new Error('You must be Admin or Opener to perform this action. User id: ' + session?.user?.id);
  }
  
  try {
    if (contest?.coverImage) {
      await deleteImageFromCloudinary(contest.coverImage); // Delete the associated image from Cloudinary
    }
    await prisma.contest.delete({
      where: { id: contest.id },
    });
    console.log('Contest deleted, id:', contest.id, 'name:', contest.name);
  } catch (err) {
    console.error('Error deleting the contest', err);
  }
}