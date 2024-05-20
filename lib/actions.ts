'use server';
import { Track } from '@/domain/Track.schema';
import { PrismaClient } from '@prisma/client/edge';
import cloudinary from './cloudinary';
import { auth } from '@/auth';
import { UploadApiOptions } from 'cloudinary';
import { mkdir, unlink, writeFile } from 'fs/promises';
import fs from 'fs';
import { isAdmin, isOpener } from '@/utils/session.utils';
import processTrackStats from './userStatsProcessor';


const prisma = new PrismaClient()

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


export async function getAllTracksForUser(userId: string, zones?: number[], levels?: string[], showRemoved?: string): Promise<Track[]> {
  // Initialize an empty array for dynamic AND conditions
  let andConditions = [];
  // If zones are provided and not empty, add zone condition
  if (zones && zones.length > 0) {
    andConditions.push({
      zone: {
        in: zones,
      },
    });
  }
  // If levels are provided and not empty, add level condition
  if (levels && levels.length > 0) {
    andConditions.push({
      level: {
        in: levels,
      },
    });
  }
  // If showRemoved is provided, add removed condition
  if (!showRemoved || showRemoved === 'NO') {
    // Default to not showing removed tracks
    andConditions.push({
      removed: false,
    });
  } else if (showRemoved === 'ONLY') {
    andConditions.push({
      removed: true,
    });
  } else {
    // showRemoved === 'YES'
    // No filter needed
  }

  let whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};

  const tracks = await prisma.track.findMany({
    where: whereCondition,
    include: {
      trackProgress: {
        select: {
          status: true,
          dateCompleted: true,
        },
        where: { userId: userId },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
  if (tracks) {
    return tracks.map(mergeTrackWithProgress);
  }
  return [] as Track[];
}


export async function getTrackDetails(
  trackId: number,
  userId: string
) {
  try {
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: {
        trackProgress: {
          select: {
            status: true,
            dateCompleted: true,
          },
          where: { userId: userId },
        },
      },
    });

    if (track) {
      return mergeTrackWithProgress(track);
    }
    return null;
  } catch (err) {
    console.error('Error fetching track details', err);
    return null;
  }
}

const mergeTrackWithProgress = (track: any): Track => {
  const userProgress = track.trackProgress[0] || undefined;
  const result = {
    ...track,
    trackProgress: { ...userProgress },
  };
  return result;
}


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

export async function postPhoto(
  track: FormData
) {
  const user = await auth();
  if (isOpener(user) === false){
    throw new Error('You must be Admin or Opener in to perform this action. User: \n' + user);
  }

  try {
    let uploadedImageUrl = '';

    // Delete previous image
    const oldImageUrl = track.get('imageUrl') as string;
    if (oldImageUrl && track.get('photo')) {
      await deleteImageFromCloudinary(oldImageUrl);
    }

    // Upload new image
    if (track.get('photo')) {
      const file: File | null = track.get('photo') as unknown as File
      uploadedImageUrl = await uploadImageToCloudinary(file);
    }
    return uploadedImageUrl;
  } catch (err) {
    console.error('Error uploading image', err);
    return '';
  }
}

async function deleteImageFromCloudinary(imageUrl: string) {
  if (!imageUrl) {
    console.log('No Image URL');
    return;
  }
  await cloudinary.uploader.destroy(imageUrl);
  console.log('Deleted image from Cloudinary:', imageUrl);
}

async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!file) {
    console.log('No File');
    return '';
  }

  // Create tmp folder if it doesn't exist
  if (!fs.existsSync('/tmp')) {
    console.log('createdir path');
    await mkdir('/tmp');
  }

  // Write file to tmp folder
  const path = `/tmp/${file.name}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path, buffer);

  // Upload image to Cloudinary
  const result = await cloudinary.uploader.upload(path, {
    folder: 'SocialParoiApp/Tracks/',
  } as UploadApiOptions);
  const uploadedImageUrl = result.public_id;
  console.log('Uploaded image to Cloudinary:', uploadedImageUrl);

  // Delete the file after it has been uploaded
  await unlink(path);
  console.log('Deleted file:', path);

  return uploadedImageUrl;
}

export async function MountOrUnmountTrack(
  trackId: number,
  removeTrack: boolean
) {
  const session = await auth();
  if (isOpener(session) === false) {
    throw new Error('You must be Admin or Opener in to perform this action. User id: ' + session?.user?.id);
  }
  try {
    await prisma.track.update({
      where: { id: trackId },
      data: {
        removed: removeTrack,
      },
    });
    return true;
  } catch (err) {
    console.error('Error updating the track', err);
    return false;
  }
}

export async function deleteTrackAndImage(track: Track) {
  const session = await auth();
  if (isOpener(session) === false) {
    throw new Error('You must be Admin or Opener in to perform this action. User id: ' + session?.user?.id);
  }
  try {
    if (track?.imageUrl) {
      await deleteImageFromCloudinary(track.imageUrl);
    }
    await prisma.track.delete({
      where: { id: track.id },
    });
    console.log('Track deleted, id:', track.id, 'name:', track.name);
  } catch (err) {
    console.error('Error deleting the track', err);
  }
}


export async function getUserStats(userId: string) {
  // Query to get tracks and done by the user, and total done by the user
  const userTrackStats = await prisma.userTrackProgress.findMany({
    where: {
      userId,
      status: 'DONE',
    },
    select: {
      track: {
        select: {
          level: true,
          removed: true,
        },
      },
    },
  });

  // Query to get total number of tracks mounted by difficulty
  const totalMountedTracksByDifficulty = await prisma.track.groupBy({
    by: ['level'],
    _count: {
      _all: true,
    },
  });
  const processStats = processTrackStats(userTrackStats as { track: Track }[], totalMountedTracksByDifficulty as { _count: { _all: number }, level: string }[]);

  return processStats;
};
