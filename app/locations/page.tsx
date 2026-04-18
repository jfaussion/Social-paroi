export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/prisma';
import { getUserLocations } from '@/lib/locations/actions/getUserLocations';
import { joinLocation } from '@/lib/locations/actions/joinLocation';

export default async function LocationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [userMemberships, publishedLocations] = await Promise.all([
    getUserLocations(session.user.id),
    prisma.location.findMany({ where: { status: 'published' } }),
  ]);

  const joinedLocationIds = new Set(userMemberships.map((m) => m.locationId));
  const locationsToJoin = publishedLocations.filter((l) => !joinedLocationIds.has(l.id));

  return (
    <main className="flex flex-col items-center p-4 sm:p-24 sm:pt-8">
      <h1 className="text-3xl font-bold mb-8">Locations</h1>

      {userMemberships.length > 0 && (
        <section className="w-full max-w-2xl mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Your Locations
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {userMemberships.map((membership) => {
              const loc = membership.location;
              return (
                <Link
                  key={loc.id}
                  href={`/${loc.slug}/tracks`}
                  className="block rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 p-5 hover:border-gray-400 dark:hover:border-neutral-500 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-1">{loc.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-1">
                    {loc.type}
                  </p>
                  {loc.address && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{loc.address}</p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Join a Location
        </h2>
        {locationsToJoin.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            You have joined all available locations.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {locationsToJoin.map((loc) => (
              <div
                key={loc.id}
                className="rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 p-5"
              >
                <h3 className="text-lg font-semibold mb-1">{loc.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-1">
                  {loc.type}
                </p>
                {loc.address && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{loc.address}</p>
                )}
                <form
                  action={async () => {
                    'use server';
                    await joinLocation(loc.id, loc.slug!);
                  }}
                >
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                  >
                    Join
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}