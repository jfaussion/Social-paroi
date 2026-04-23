import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { getLocationBySlug } from '@/lib/locations/actions/getLocationBySlug';
import { getLocationMembers } from '@/lib/locations/actions/manageLocationUsers';
import UserManagementTable from '@/components/admin/UserManagementTable';

export default async function UsersPage({
  params,
}: {
  params: Promise<{ locationSlug: string }>;
}) {
  const { locationSlug } = await params;
  const location = await getLocationBySlug(locationSlug);
  if (!location) notFound();

  const [members, session] = await Promise.all([
    getLocationMembers(location.id),
    auth(),
  ]);

  return (
    <div className="w-full max-w-2xl">
      <Link
        href={`/${locationSlug}/admin`}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
      >
        &larr; Back to Admin
      </Link>
      <h1 className="text-2xl font-bold mb-6">Users &amp; Roles</h1>
      <UserManagementTable
        members={members}
        locationId={location.id}
        currentUserId={session?.user?.id}
      />
    </div>
  );
}
