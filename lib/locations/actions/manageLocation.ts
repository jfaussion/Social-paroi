'use server';
import { auth } from '@/auth';
import prisma from '@/prisma';
import { LocationRoleEnum } from '@/domain/LocationRole.enum';
import { LocationStatus } from '@/domain/LocationStatus.enum';
import { isSuperAdmin } from '@/utils/session.utils';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';

export async function updateLocationSettings(
  locationId: number,
  data: { name?: string; address?: string; website?: string; mapImageUrl?: string }
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  const hasAccess = await checkUserLocationRole(
    session.user.id,
    locationId,
    LocationRoleEnum.Enum.admin
  );
  if (!hasAccess) return { error: 'Forbidden' };

  if (data.mapImageUrl !== undefined) {
    const current = await prisma.location.findUnique({
      where: { id: locationId },
      select: { mapImageUrl: true },
    });
    if (current?.mapImageUrl && current.mapImageUrl !== data.mapImageUrl) {
      await deleteImageFromCloudinary(current.mapImageUrl);
    }
  }

  await prisma.location.update({
    where: { id: locationId },
    data,
  });

  return { success: true };
}

export async function regenerateInviteToken(
  locationId: number
): Promise<{ inviteToken: string } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  const hasAccess = await checkUserLocationRole(
    session.user.id,
    locationId,
    LocationRoleEnum.Enum.admin
  );
  if (!hasAccess) return { error: 'Forbidden' };

  const inviteToken = crypto.randomUUID();

  await prisma.location.update({
    where: { id: locationId },
    data: { inviteToken },
  });

  return { inviteToken };
}

export async function getInviteLink(locationId: number): Promise<string | null> {
  const location = await prisma.location.findUnique({
    where: { id: locationId },
    select: { inviteToken: true },
  });

  if (!location?.inviteToken) return null;

  return `${process.env.NEXT_PUBLIC_HOME_URL}/join/${location.inviteToken}`;
}

export async function createLocation(data: {
  name: string;
  type: string;
  address?: string;
  website?: string;
  slug: string;
}): Promise<{ id: number; name: string; slug: string | null } | { error: string }> {
  const session = await auth();
  if (!isSuperAdmin(session)) return { error: 'Forbidden' };

  const location = await prisma.location.create({
    data: {
      ...data,
      status: LocationStatus.hidden,
    },
    select: { id: true, name: true, slug: true },
  });

  return location;
}

export async function publishLocation(
  locationId: number
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!isSuperAdmin(session)) return { error: 'Forbidden' };

  await prisma.location.update({
    where: { id: locationId },
    data: { status: LocationStatus.published },
  });

  return { success: true };
}

export async function hideLocation(
  locationId: number
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!isSuperAdmin(session)) return { error: 'Forbidden' };

  await prisma.location.update({
    where: { id: locationId },
    data: { status: LocationStatus.hidden },
  });

  return { success: true };
}
