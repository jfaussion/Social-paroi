import { getTrackDetails } from "@/app/lib/actions";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import Image from 'next/image';
import placeholderImage from "@/public/bouldering-placeholder.jpeg";
import TrackDetails from "@/components/TrackDetails";

export const dynamic = 'force-dynamic'

export default async function TrackDetailsPage({ params }: { params: { trackId: number } }) {

  const session = await auth();

  const userId = session?.user?.id ?? "";
  const track = await getTrackDetails(params.trackId, parseInt(userId));

  return (
    <SessionProvider session={session}>
      {track ?
      (
        <TrackDetails key={track.id} {...track}/>
      ): (
        <div>
          <h1>Track not found</h1>
          <Image src={placeholderImage} alt="Climbing Track - place holder" fill sizes='(max-width: 200px)' />
        </div>
      )}
    </SessionProvider>
  );
}