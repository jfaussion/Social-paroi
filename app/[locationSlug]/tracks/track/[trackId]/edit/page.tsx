import { auth } from "@/auth";
import TrackForm from "@/components/tracks/TrackForm";
import { getTrackDetails } from "@/lib/tracks/actions/getTrackDetails";
import { getLocationBySlug } from "@/lib/locations/actions/getLocationBySlug";
import { getZonesByLocation } from "@/lib/locations/actions/getZonesByLocation";
import { getHoldColors } from "@/lib/locations/actions/manageHoldColors";
import { getDifficultyLevels } from "@/lib/locations/actions/manageDifficultyLevels";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function TrackEditPage({ params }: { params: { locationSlug: string; trackId: string } }) {
  const session = await auth();

  const userId = session?.user?.id ?? "";
  const trackId = parseInt(params.trackId, 10);
  if (isNaN(trackId) || trackId <= 0) {
    redirect(`/${params.locationSlug}/tracks`);
  }
  const track = await getTrackDetails(trackId, userId);
  if (!track) {
    console.log('No track found, redirecting to tracks list');
    redirect(`/${params.locationSlug}/tracks`);
  }

  const location = await getLocationBySlug(params.locationSlug);
  if (!location) {
    redirect(`/${params.locationSlug}/tracks`);
  }

  const [zones, holdColors, difficultyLevels] = await Promise.all([
    getZonesByLocation(location.id),
    getHoldColors(location.id),
    getDifficultyLevels(location.id),
  ]);

  return (
    <SessionProvider session={session}>
      <main className="flex flex-col items-center justify-between p-4 sm:p-24 sm:pt-4 sm:pb-4">
        <div className="w-full max-w-2xl items-center ">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold w-full p-4 pt-0">
              Edit block
            </span>
            {track &&
              (
                <TrackForm key={track.id} initialTrack={track} locationId={location.id} zones={zones} holdColors={holdColors} difficultyLevels={difficultyLevels} />
              )}
          </div>
        </div>
      </main>
    </SessionProvider>
  );
}
