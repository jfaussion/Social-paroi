
'use server';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { uploadImageToCloudinary } from '@/lib/cloudinary/uploadToCloudinary';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { CloudinarySubfolders } from '@/lib/cloudinary/cloudinarySubfolders';
import { createActionLogger } from '@/utils/logger';

const trackSubfolder = 'Tracks';
const logger = createActionLogger('postTrackImage');


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
    const error = new Error('You must be Admin or Opener in to perform this action.');
    logger.error(error, { userId: user?.user?.id });
    throw error;
  }

  try {
    const photoEntry = track.get('photo') as unknown as File | null;
    const oldImageUrl = track.get('imageUrl') as string | null;
    const hasPhoto = Boolean(photoEntry);
    const hadExistingImage = Boolean(oldImageUrl);

    logger.start({ hasPhoto, hadExistingImage });

    let uploadedImageUrl = '';

    // Delete previous image
    if (oldImageUrl && photoEntry) {
      await deleteImageFromCloudinary(oldImageUrl);
    }

    // Upload new image
    if (photoEntry) {
      uploadedImageUrl = await uploadImageToCloudinary(photoEntry, CloudinarySubfolders.TRACKS);
    }
    logger.success({ uploaded: Boolean(uploadedImageUrl), hadExistingImage });
    return uploadedImageUrl;
  } catch (err) {
    const hasPhoto = Boolean(track.get('photo'));
    const hadExistingImage = Boolean(track.get('imageUrl'));
    logger.error(err, { hasPhoto, hadExistingImage });
    return '';
  }
}
