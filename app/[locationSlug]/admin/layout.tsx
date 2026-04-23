import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getLocationBySlug } from '@/lib/locations/actions/getLocationBySlug';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationRoleEnum } from '@/domain/LocationRole.enum';

export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locationSlug: string }>;
}>) {
  const { locationSlug } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect(`/${locationSlug}/tracks`);
  }

  const location = await getLocationBySlug(locationSlug);

  if (!location) {
    redirect(`/${locationSlug}/tracks`);
  }

  const hasAccess = await checkUserLocationRole(userId, location.id, LocationRoleEnum.Enum.admin);

  if (!hasAccess) {
    redirect(`/${locationSlug}/tracks`);
  }

  return (
    <main className="flex flex-col items-center justify-between p-4 sm:p-24 sm:pt-4 sm:pb-4">
      {children}
    </main>
  );
}
