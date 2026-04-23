'use server';
import prisma from '@/prisma';

export async function getUserLocations(userId: string) {
  return prisma.userLocation.findMany({ where: { userId }, include: { location: true } });
}
