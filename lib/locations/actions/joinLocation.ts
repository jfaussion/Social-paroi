'use server';
import prisma from '@/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function joinLocation(locationId: number, slug: string) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  await prisma.userLocation.upsert({
    where: { userId_locationId: { userId: session.user.id, locationId } },
    update: {},
    create: { userId: session.user.id, locationId },
  });

  redirect(`/${slug}/tracks`);
}
