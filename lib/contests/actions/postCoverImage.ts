'use server';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { uploadImageToCloudinary } from '@/lib/cloudinary/uploadToCloudinary';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { CloudinarySubfolders } from '@/lib/cloudinary/cloudinarySubfolders';

/**
 * Uploads a new cover image to Cloudinary and deletes the previous one if necessary.
 * Returns the URL of the uploaded cover image.
 * 
 * @param contest - The contest to upload the cover image to.
 * @throws Error - If the user is not an Admin or Opener.
 * @returns The URL of the uploaded cover image.
 */
export async function postCoverImage(contest: FormData) {
  const user = await auth();
  if (isOpener(user) === false) {
    throw new Error('You must be Admin or Opener to perform this action. User: \n' + user);
  }

  try {
    let uploadedImageUrl = '';

    // Delete previous image
    const oldImageUrl = contest.get('coverImageUrl') as string;
    if (oldImageUrl && contest.get('coverPhoto')) {
      await deleteImageFromCloudinary(oldImageUrl);
    }

    // Upload new image
    if (contest.get('coverPhoto')) {
      const file: File | null = contest.get('coverPhoto') as unknown as File;
      uploadedImageUrl = await uploadImageToCloudinary(file, CloudinarySubfolders.CONTESTS);
    }
    return uploadedImageUrl;
  } catch (err) {
    console.error('Error uploading cover image', err);
    return '';
  }
}