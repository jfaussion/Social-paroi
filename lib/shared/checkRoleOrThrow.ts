'use server';
import { auth } from '@/auth';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { createActionLogger } from '@/utils/logger';
import type { LocationRole } from '@/domain/LocationRole.enum';

export interface CheckRoleOptions {
  locationId: number;
  requiredRole?: LocationRole;
  actionName?: string;
  locationSlug?: string;
}

const defaultLogger = createActionLogger('checkRoleOrThrow');

export async function checkRoleOrThrow(options: CheckRoleOptions): Promise<string> {
  const { locationId, requiredRole = 'opener', actionName = 'perform this action', locationSlug } = options;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('Authentication required');
  }

  const hasRole = await checkUserLocationRole(userId, locationId, requiredRole);
  if (!hasRole) {
    const error = new Error(`You must be ${requiredRole} to ${actionName}.`);
    defaultLogger.error(error, { userId, locationId, locationSlug });
    throw error;
  }

  return userId;
}
