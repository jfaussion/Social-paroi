'use server';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { uploadImageToCloudinary } from '@/lib/cloudinary/uploadToCloudinary';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { CloudinarySubfolders } from '@/lib/cloudinary/cloudinarySubfolders';

/**
 * Uploads a new activity image to Cloudinary and deletes the previous one if necessary.
 * 
 * @param activity - The activity form data containing the image.
 * @throws Error - If the user is not an Admin or Opener.
 * @returns The URL of the uploaded activity image.
 */
export async function postActivityImage(activity: FormData) {
  const user = await auth();
  if (!isOpener(user)) {
    throw new Error('You must be Admin or Opener to perform this action.');
  }

  try {
    let uploadedImageUrl = '';

    // Delete previous image if it exists
    const oldImageUrl = activity.get('imageFileUrl') as string;
    if (oldImageUrl && activity.get('activityPhoto')) {
      await deleteImageFromCloudinary(oldImageUrl);
    }

    // Upload new image
    if (activity.get('activityPhoto')) {
      const file: File | null = activity.get('activityPhoto') as unknown as File;
      uploadedImageUrl = await uploadImageToCloudinary(file, CloudinarySubfolders.ACTIVITIES);
    }
    return uploadedImageUrl;
  } catch (err) {
    console.error('Error uploading activity image', err);
    return '';
  }
} 