
'use server';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import { createActionLogger } from '@/utils/logger';
import { parseIntOrThrow } from '@/lib/utils/validation';

const logger = createActionLogger('deletePreviousTrackImage');

export async function deletePreviousTrackImage(track: FormData) {
  const locationId = parseIntOrThrow(track.get('locationId') as string, 'locationId');
  await checkRoleOrThrow({ locationId, actionName: 'delete track image' });

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
