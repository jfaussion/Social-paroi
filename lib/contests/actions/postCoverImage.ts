'use server';
import { uploadImageToCloudinary } from '@/lib/cloudinary/uploadToCloudinary';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { CloudinarySubfolders } from '@/lib/cloudinary/cloudinarySubfolders';
import { parseIntOrThrow } from '@/lib/utils/validation';
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import { createActionLogger } from '@/utils/logger';

const logger = createActionLogger('postCoverImage');

export async function postCoverImage(contest: FormData) {
  const locationIdStr = contest.get('locationId') as string | null;
  if (!locationIdStr) {
    throw new Error('locationId is required');
  }
  const locationId = parseIntOrThrow(locationIdStr, 'locationId');
  await checkRoleOrThrow({ locationId, actionName: 'upload cover image' });

  try {
    const coverPhoto = contest.get('coverPhoto') as unknown as File | null;
    const oldImageUrl = contest.get('coverImageUrl') as string | null;
    const hasPhoto = Boolean(coverPhoto);
    const hadExistingImage = Boolean(oldImageUrl);

    logger.start({ hasPhoto, hadExistingImage });

    let uploadedImageUrl = '';

    if (oldImageUrl && coverPhoto) {
      await deleteImageFromCloudinary(oldImageUrl);
    }

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
