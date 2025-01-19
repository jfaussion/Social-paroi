
'use server';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { uploadImageToCloudinary } from '@/lib/cloudinary/uploadToCloudinary';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { CloudinarySubfolders } from '@/lib/cloudinary/cloudinarySubfolders';

const trackSubfolder = 'Tracks';


/**
 * Uploads a new photo to Cloudinary and deletes the previous one if necessary.
 * Returns the URL of the uploaded image.
 * 
 * @param track - The track to upload the photo to.
 * @throws Error - If the user is not an Admin or Opener.
 * @returns The URL of the uploaded image.
 */
export async function postTrackImage(
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
      uploadedImageUrl = await uploadImageToCloudinary(file, CloudinarySubfolders.TRACKS);
    }
    return uploadedImageUrl;
  } catch (err) {
    console.error('Error uploading image', err);
    return '';
  }
}