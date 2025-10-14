'use server';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { uploadImageToCloudinary } from '@/lib/cloudinary/uploadToCloudinary';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { CloudinarySubfolders } from '@/lib/cloudinary/cloudinarySubfolders';
import { createActionLogger } from '@/utils/logger';

const logger = createActionLogger('postActivityImage');

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
    const error = new Error('You must be Admin or Opener to perform this action.');
    logger.error(error, { userId: user?.user?.id });
    throw error;
  }

  try {
    const photoEntry = activity.get('activityPhoto') as unknown as File | null;
    const oldImageUrl = activity.get('imageFileUrl') as string | null;
    const hasPhoto = Boolean(photoEntry);
    const hadExistingImage = Boolean(oldImageUrl);

    logger.start({ hasPhoto, hadExistingImage });

    let uploadedImageUrl = '';

    // Delete previous image if it exists
    if (oldImageUrl && hasPhoto) {
      await deleteImageFromCloudinary(oldImageUrl);
    }

    // Upload new image
    if (photoEntry) {
      uploadedImageUrl = await uploadImageToCloudinary(photoEntry, CloudinarySubfolders.ACTIVITIES);
    }
    logger.success({ uploaded: Boolean(uploadedImageUrl), hadExistingImage });
    return uploadedImageUrl;
  } catch (err) {
    const photoPresent = Boolean(activity.get('activityPhoto'));
    const imagePresent = Boolean(activity.get('imageFileUrl'));
    logger.error(err, { hasPhoto: photoPresent, hadExistingImage: imagePresent });
    return '';
  }
} 
