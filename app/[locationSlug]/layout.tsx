import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import NavBar from '@/components/Navbar';
import { getLocationBySlug } from '@/lib/locations/actions/getLocationBySlug';
import { getUserLocations } from '@/lib/locations/actions/getUserLocations';
import { LocationStatus } from '@/domain/LocationStatus.enum';

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

  if (location.status === LocationStatus.hidden) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      redirect('/locations');
    }

    const memberships = await getUserLocations(userId);
    const isMember = memberships.some((m) => m.locationId === location.id);

    if (!isMember) {
      redirect('/locations');
    }
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
