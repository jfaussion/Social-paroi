'use server';
import { uploadImageToCloudinary } from '@/lib/cloudinary/uploadToCloudinary';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { CloudinarySubfolders } from '@/lib/cloudinary/cloudinarySubfolders';
import { parseIntOrThrow } from '@/lib/utils/validation';
import prisma from '@/prisma';
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import { createActionLogger } from '@/utils/logger';

const logger = createActionLogger('postActivityImage');

export async function postActivityImage(activity: FormData) {
  const contestIdStr = activity.get('contestId') as string | null;
  if (!contestIdStr) {
    throw new Error('contestId is required');
  }
  const contestId = parseIntOrThrow(contestIdStr, 'contestId');
  const contest = await prisma.contest.findUnique({ where: { id: contestId }, select: { locationId: true } });
  if (!contest?.locationId) {
    throw new Error('Contest not found');
  }
  await checkRoleOrThrow({ locationId: contest.locationId, actionName: 'upload activity image' });

  try {
    const photoEntry = activity.get('activityPhoto') as unknown as File | null;
    const oldImageUrl = activity.get('imageFileUrl') as string | null;
    const hasPhoto = Boolean(photoEntry);
    const hadExistingImage = Boolean(oldImageUrl);

    logger.start({ hasPhoto, hadExistingImage });

    let uploadedImageUrl = '';

    if (oldImageUrl && hasPhoto) {
      await deleteImageFromCloudinary(oldImageUrl);
    }

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
