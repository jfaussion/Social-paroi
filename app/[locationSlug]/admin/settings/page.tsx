import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocationBySlug } from '@/lib/locations/actions/getLocationBySlug';
import { getInviteLink } from '@/lib/locations/actions/manageLocation';
import LocationSettingsForm from '@/components/admin/LocationSettingsForm';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locationSlug: string }>;
}) {
  const { locationSlug } = await params;
  const location = await getLocationBySlug(locationSlug);
  if (!location) notFound();

  const inviteLink = await getInviteLink(location.id);

  return (
    <div className="w-full max-w-lg">
      <Link
        href={`/${locationSlug}/admin`}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
      >
        &larr; Back to Admin
      </Link>
      <h1 className="text-2xl font-bold mb-6">Location Settings</h1>
      <LocationSettingsForm location={location} inviteLink={inviteLink} locationSlug={locationSlug} />
    </div>
  );
}
