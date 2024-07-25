'use server';
import { PrismaClient } from '@prisma/client/edge';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';

const prisma = new PrismaClient();

/**
 * Creates a new track or updates an existing one.
 * Assuming the image is uploaded and the URL is passed in the form data.
 * 
 * @param trackId - The track id.
 * @param track - The track data.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function postNewTrack(
  trackId: number | undefined,
  track: FormData
) {
  const user = await auth();
  if (isOpener(user) === false){
    throw new Error('You must be Admin or Opener in to perform this action. User: \n' + user);
  }

  try {
    const newTrack = await prisma.track.upsert({
      where: {
        id: trackId ?? -1,
      },
      update: {
        name: track.get('name') as string,
        zone: parseInt(track.get('zone') as string),
        level: track.get('level') as string,
        holdColor: track.get('holdColor') as string,
        points: parseInt(track.get('points') as string),
        imageUrl: track.get('imageUrl') as string,
        removed: track.get('removed') === 'true' ? true : false,
      },
      create: {
        name: track.get('name') as string,
        zone: parseInt(track.get('zone') as string),
        level: track.get('level') as string,
        holdColor: track.get('holdColor') as string,
        points: parseInt(track.get('points') as string),
        date: new Date(),
        imageUrl: track.get('imageUrl') as string,
        removed: false,
      },
    });
    return newTrack;
  } catch (err) {
    console.error('Error creating new track', err);
    return null;
  }
}