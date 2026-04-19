import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import TrackList from "@/components/tracks/TrackList";
import { getLocationBySlug } from "@/lib/locations/actions/getLocationBySlug";
import { getZonesByLocation } from "@/lib/locations/actions/getZonesByLocation";
import { getUserLocations } from "@/lib/locations/actions/getUserLocations";
import { notFound } from "next/navigation";
import Image from "next/image";
import { isOpener } from "@/utils/session.utils";

export const dynamic = 'force-dynamic'

export default async function TracksPage({
  params,
}: {
  params: Promise<{ locationSlug: string }>;
}) {
  const { locationSlug } = await params;
  const location = await getLocationBySlug(locationSlug);
  if (!location) notFound();

  const [zones, session] = await Promise.all([
    getZonesByLocation(location.id),
    auth(),
  ]);
  const userId = session?.user?.id ?? "";

  const isMember = userId
    ? isOpener(session) || (await getUserLocations(userId)).some((m) => m.locationId === location.id)
    : false;

  const mapSrc = location.mapImageUrl
    ? location.mapImageUrl.startsWith('http')
      ? location.mapImageUrl
      : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${location.mapImageUrl}`
    : null;

  return (
    <SessionProvider session={session}>
      <main className="flex flex-col items-center justify-between p-4 sm:p-24 sm:pt-8 sm:pb-8">

        {mapSrc && (
          <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-2/3 after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
            <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert lg:max-w-2xl"
              src={mapSrc}
              alt="Bouldering map"
              width={680}
              height={300}
              priority
              unoptimized
            />
          </div>
        )}

        {userId ? (
          <TrackList userId={userId} locationId={location.id} zones={zones} isMember={isMember} />
        ) : (
          <div className="bg-red-900 border border-red-500 rounded p-4">
            <p className="text-red-300">Error, sign in to see your tracks...</p>
          </div>
        )}

      </main>
    </SessionProvider>
  );
}
