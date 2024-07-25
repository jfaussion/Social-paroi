import { auth } from "@/auth";
import TrackForm from "@/components/TrackForm";
import { getTrackDetails } from "@/lib/tracks/actions/getTrackDetails";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function TrackEditPage({ params }: { params: { trackId: string } }) {
  const session = await auth();

  const userId = session?.user?.id ?? "";
  const track = await getTrackDetails(parseInt(params.trackId), userId);
  if (!track) {
    console.log('No track found, redirecting to dashboard');
    redirect('/dashboard');
  }

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
                <TrackForm key={track.id} initialTrack={track} />
              )}
          </div>
        </div>
      </main>
    </SessionProvider>
  );
}
