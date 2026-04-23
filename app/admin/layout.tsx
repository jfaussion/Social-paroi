export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isSuperAdmin } from '@/utils/session.utils';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!isSuperAdmin(session)) redirect('/locations');

  return <main>{children}</main>;
}
