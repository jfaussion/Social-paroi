export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/prisma';
import { getUserLocations } from '@/lib/locations/actions/getUserLocations';
import { joinLocation } from '@/lib/locations/actions/joinLocation';
import { LocationStatus } from '@/domain/LocationStatus.enum';
import { Button } from '@/components/ui/Button';

export default async function LocationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [userMemberships, publishedLocations] = await Promise.all([
    getUserLocations(session.user.id),
    prisma.location.findMany({ where: { status: LocationStatus.published } }),
  ]);

  const joinedLocationIds = new Set(userMemberships.map((m) => m.locationId));
  const locationsToJoin = publishedLocations.filter((l) => !joinedLocationIds.has(l.id));

  return (
    <main className="flex flex-col items-center justify-between p-4 sm:p-24 sm:pt-4 sm:pb-4">
      <h1 className="text-3xl font-bold mb-8">Locations</h1>

      {userMemberships.length > 0 && (
        <section className="w-full max-w-3xl mb-10">
          <span className="text-xl font-semibold w-full p-4 pt-0 block">Your Locations</span>
          <div className="grid gap-4 sm:grid-cols-2">
            {userMemberships.map((membership) => {
              const loc = membership.location;
              return (
                <Link
                  key={loc.id}
                  href={`/${loc.slug}/tracks`}
                  className="block bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-5 hover:from-slate-200 hover:to-slate-100 dark:hover:from-gray-600 dark:hover:to-gray-800 transition-colors"
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

      <section className="w-full max-w-3xl">
        <span className="text-xl font-semibold w-full p-4 pt-0 block">Join a Location</span>
        {locationsToJoin.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm px-4">
            You have joined all available locations.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {locationsToJoin.map((loc) => (
              <div
                key={loc.id}
                className="bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-5"
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
                  <Button type="submit" btnType="secondary" className="mt-2 w-full">
                    Join
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}