import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import NavBar from '@/components/Navbar';
import { getLocationBySlug } from '@/lib/locations/actions/getLocationBySlug';
import { getUserLocations } from '@/lib/locations/actions/getUserLocations';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationStatus } from '@/domain/LocationStatus.enum';
import { LocationRoleEnum } from '@/domain/LocationRole.enum';
import { isSuperAdmin } from '@/utils/session.utils';

export default async function LocationLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locationSlug: string }>;
}>) {
  const { locationSlug } = await params;
  const location = await getLocationBySlug(locationSlug);

  if (!location) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (location.status === LocationStatus.hidden) {
    if (!userId) {
      redirect('/locations');
    }

    const memberships = await getUserLocations(userId);
    const isMember = memberships.some((m) => m.locationId === location.id);

    if (!isMember && !isSuperAdmin(session)) {
      redirect('/locations');
    }
  }

  const isLocationAdmin = userId
    ? isSuperAdmin(session) || await checkUserLocationRole(userId, location.id, LocationRoleEnum.Enum.admin)
    : false;

  return (
    <>
      <NavBar isLocationAdmin={isLocationAdmin} />
      {children}
    </>
  );
}
