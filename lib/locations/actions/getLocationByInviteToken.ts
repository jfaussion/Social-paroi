'use server';
import prisma from '@/prisma';

export async function getLocationByInviteToken(inviteToken: string) {
  return prisma.location.findUnique({ where: { inviteToken } });
}