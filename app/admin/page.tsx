import Link from 'next/link';
import prisma from '@/prisma';
import { LocationStatus } from '@/domain/LocationStatus.enum';

export default async function AdminPage() {
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, slug: true, status: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="flex flex-col items-center p-4 sm:p-24 sm:pt-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Super Admin</h1>
          <Link
            href="/admin/locations"
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
          >
            Manage Locations
          </Link>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            All Locations
          </h2>
          {locations.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No locations found.</p>
          ) : (
            <div className="space-y-3">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center justify-between rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{loc.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        loc.status === LocationStatus.published
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {loc.status === LocationStatus.published ? 'Published' : 'Hidden'}
                    </span>
                  </div>
                  {loc.slug && (
                    <Link
                      href={`/${loc.slug}/admin`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Admin panel
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
