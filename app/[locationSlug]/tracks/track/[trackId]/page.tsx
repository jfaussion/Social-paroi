import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Image from 'next/image';
import placeholderImage from "@/public/bouldering-placeholder.jpeg";
import TrackDetails from "@/components/tracks/TrackDetails";
import { redirect } from "next/navigation";
import { getTrackDetails } from "@/lib/tracks/actions/getTrackDetails";
import { checkUserLocationRole } from "@/lib/locations/actions/checkUserLocationRole";
import { LocationRole } from "@/domain/LocationRole.enum";
import { getLocationBySlug } from "@/lib/locations/actions/getLocationBySlug";

export const dynamic = 'force-dynamic'

export default async function TrackDetailsPage({ params }: { params: { locationSlug: string; trackId: string } }) {

  const session = await auth();

  const userId = session?.user?.id ?? "";
  const [track, location] = await Promise.all([
    getTrackDetails(parseInt(params.trackId), userId),
    getLocationBySlug(params.locationSlug),
  ]);
  if (!track) {
    console.log('No track found, redirecting to tracks list');
    redirect(`/${params.locationSlug}/tracks`);
  }

  const isOpener = userId && location
    ? await checkUserLocationRole(userId, location.id, LocationRole.opener)
    : false;

  return (
    <SessionProvider session={session}>
      {track ?
      (
        <TrackDetails key={track.id} {...track} isOpener={isOpener}/>
      ): (
        <div>
          <h1>Track not found</h1>
          <Image src={placeholderImage} alt="Climbing Track - place holder" fill sizes='(max-width: 200px)' />
        </div>
      )}
    </SessionProvider>
  );
}