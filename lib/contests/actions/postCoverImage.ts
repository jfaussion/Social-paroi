'use server';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { uploadImageToCloudinary } from '@/lib/cloudinary/uploadToCloudinary';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { CloudinarySubfolders } from '@/lib/cloudinary/cloudinarySubfolders';
import { createActionLogger } from '@/utils/logger';

const logger = createActionLogger('postCoverImage');

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
    const error = new Error('You must be Admin or Opener to perform this action.');
    logger.error(error, { userId: user?.user?.id });
    throw error;
  }

  try {
    const coverPhoto = contest.get('coverPhoto') as unknown as File | null;
    const oldImageUrl = contest.get('coverImageUrl') as string | null;
    const hasPhoto = Boolean(coverPhoto);
    const hadExistingImage = Boolean(oldImageUrl);

    logger.start({ hasPhoto, hadExistingImage });

    let uploadedImageUrl = '';

    // Delete previous image
    if (oldImageUrl && coverPhoto) {
      await deleteImageFromCloudinary(oldImageUrl);
    }

    // Upload new image
    if (coverPhoto) {
      uploadedImageUrl = await uploadImageToCloudinary(coverPhoto, CloudinarySubfolders.CONTESTS);
    }
    logger.success({ uploaded: Boolean(uploadedImageUrl), hadExistingImage });
    return uploadedImageUrl;
  } catch (err) {
    const hasPhoto = Boolean(contest.get('coverPhoto'));
    const hadExistingImage = Boolean(contest.get('coverImageUrl'));
    logger.error(err, { hasPhoto, hadExistingImage });
    return '';
  }
}
