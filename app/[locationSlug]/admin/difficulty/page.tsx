import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocationBySlug } from '@/lib/locations/actions/getLocationBySlug';
import { getDifficultyLevels } from '@/lib/locations/actions/manageDifficultyLevels';
import DifficultyLevelList from '@/components/admin/DifficultyLevelList';

export default async function DifficultyPage({
  params,
}: {
  params: Promise<{ locationSlug: string }>;
}) {
  const { locationSlug } = await params;
  const location = await getLocationBySlug(locationSlug);
  if (!location) notFound();

  const levels = await getDifficultyLevels(location.id);

  return (
    <div className="w-full max-w-lg">
      <Link
        href={`/${locationSlug}/admin`}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
      >
        &larr; Back to Admin
      </Link>
      <h1 className="text-2xl font-bold mb-6">Difficulty Levels</h1>
      <DifficultyLevelList levels={levels} locationId={location.id} />
    </div>
  );
}
