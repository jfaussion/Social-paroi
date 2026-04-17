'use server';
import prisma from '@/prisma';

export async function getLocationBySlug(slug: string) {
  return prisma.location.findUnique({ where: { slug } });
}
