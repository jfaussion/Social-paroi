import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getLocationByInviteToken } from '@/lib/locations/actions/getLocationByInviteToken';
import { joinLocation } from '@/lib/locations/actions/joinLocation';
import { getUserLocations } from '@/lib/locations/actions/getUserLocations';
import { LocationStatus } from '@/domain/LocationStatus.enum';

export const dynamic = 'force-dynamic';

interface JoinPageProps {
  params: Promise<{ inviteToken: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { inviteToken } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/join/${inviteToken}`);
  }

  const location = await getLocationByInviteToken(inviteToken);

  if (!location) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Invalid Invite Link</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This invite link is invalid or has expired. Please ask for a new invite link.
          </p>
          <a
            href="/locations"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Locations
          </a>
        </div>
      </main>
    );
  }

  if (location.status !== LocationStatus.published && location.status !== LocationStatus.hidden) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Location Not Available</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This location is not currently accepting new members.
          </p>
          <a
            href="/locations"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Locations
          </a>
        </div>
      </main>
    );
  }

  const userMemberships = await getUserLocations(session.user.id);
  const isAlreadyMember = userMemberships.some((m) => m.locationId === location.id);

  if (isAlreadyMember) {
    redirect(`/${location.slug}/tracks`);
  }

  const locationId = location.id;
  const locationSlug = location.slug!;

  async function handleJoin() {
    'use server';
    await joinLocation(locationId, locationSlug);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Join {location.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2 capitalize">{location.type}</p>
        {location.address && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{location.address}</p>
        )}
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          You&apos;ve been invited to join this location. Click below to become a member.
        </p>
        <form action={handleJoin}>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Join {location.name}
          </button>
        </form>
      </div>
    </main>
  );
}