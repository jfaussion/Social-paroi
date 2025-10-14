
'use server';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { createActionLogger } from '@/utils/logger';

const logger = createActionLogger('deletePreviousTrackImage');


/**
 * Deletes the previous image from Cloudinary.
 * 
 * @param track - The track to delete the image from.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function deletePreviousTrackImage(track: FormData) {
  const user = await auth();
  if (isOpener(user) === false){
    const error = new Error('You must be Admin or Opener in to perform this action.');
    logger.error(error, { userId: user?.user?.id });
    throw error;
  }

  try {
    const uploadedImageUrl = track.get('imageUrl') as string | null;
    const oldImageUrl = track.get('oldImageUrl') as string | null;
    const hasNewUrl = Boolean(uploadedImageUrl);
    const hadExistingImage = Boolean(oldImageUrl);

    logger.start({ hasNewUrl, hadExistingImage });

    // Delete previous image
    if (oldImageUrl && uploadedImageUrl) {
      await deleteImageFromCloudinary(oldImageUrl);
    }

    logger.success({ uploaded: Boolean(uploadedImageUrl), hadExistingImage });
    return uploadedImageUrl ?? '';
  } catch (err) {
    const hasNewUrl = Boolean(track.get('imageUrl'));
    const hadExistingImage = Boolean(track.get('oldImageUrl'));
    logger.error(err, { hasNewUrl, hadExistingImage });
    return '';
  }
}
