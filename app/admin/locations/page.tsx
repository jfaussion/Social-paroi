import prisma from '@/prisma';
import SuperAdminLocationsPanel from '@/components/admin/SuperAdminLocationsPanel';

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, slug: true, status: true, type: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="flex flex-col items-center p-4 sm:p-24 sm:pt-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Manage Locations</h1>
        <SuperAdminLocationsPanel locations={locations} />
      </div>
    </div>
  );
}
