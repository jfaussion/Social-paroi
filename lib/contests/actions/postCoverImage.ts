'use server';
import { auth } from '@/auth';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationRole } from '@/domain/LocationRole.enum';
import { uploadImageToCloudinary } from '@/lib/cloudinary/uploadToCloudinary';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { CloudinarySubfolders } from '@/lib/cloudinary/cloudinarySubfolders';
import { parseIntOrThrow } from '@/lib/utils/validation';
import { createActionLogger } from '@/utils/logger';

const logger = createActionLogger('postCoverImage');

export async function postCoverImage(contest: FormData) {
  const user = await auth();
  const locationIdStr = contest.get('locationId') as string | null;
  if (!locationIdStr) {
    const error = new Error('locationId is required');
    logger.error(error, { userId: user?.user?.id });
    throw error;
  }
  const locationId = parseIntOrThrow(locationIdStr, 'locationId');
  const isOpener = user?.user?.id
    ? await checkUserLocationRole(user.user.id, locationId, LocationRole.opener)
    : false;
  if (!isOpener) {
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
