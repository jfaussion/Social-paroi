import Link from 'next/link';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locationSlug: string }>;
}) {
  const { locationSlug } = await params;

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
      <ul className="space-y-3">
        <li>
          <Link
            className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            href={`/${locationSlug}/admin/difficulty`}
          >
            Difficulty levels
          </Link>
        </li>
        <li>
          <Link
            className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            href={`/${locationSlug}/admin/users`}
          >
            Users &amp; roles
          </Link>
        </li>
        <li>
          <Link
            className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            href={`/${locationSlug}/admin/zones`}
          >
            Zones
          </Link>
        </li>
        <li>
          <Link
            className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            href={`/${locationSlug}/admin/settings`}
          >
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}
