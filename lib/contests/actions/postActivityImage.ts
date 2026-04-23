'use server';
import { auth } from '@/auth';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationRole } from '@/domain/LocationRole.enum';
import { uploadImageToCloudinary } from '@/lib/cloudinary/uploadToCloudinary';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { CloudinarySubfolders } from '@/lib/cloudinary/cloudinarySubfolders';
import { parseIntOrThrow } from '@/lib/utils/validation';
import prisma from '@/prisma';
import { createActionLogger } from '@/utils/logger';

const logger = createActionLogger('postActivityImage');

export async function postActivityImage(activity: FormData) {
  const user = await auth();
  const contestIdStr = activity.get('contestId') as string | null;
  if (!contestIdStr) {
    const error = new Error('contestId is required');
    logger.error(error, { userId: user?.user?.id });
    throw error;
  }
  const contestId = parseIntOrThrow(contestIdStr, 'contestId');
  const contest = await prisma.contest.findUnique({ where: { id: contestId }, select: { locationId: true } });
  const isOpener = user?.user?.id && contest?.locationId
    ? await checkUserLocationRole(user.user.id, contest.locationId, LocationRole.opener)
    : false;
  if (!isOpener) {
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
