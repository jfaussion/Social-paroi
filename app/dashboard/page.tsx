
import Image from "next/image";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { getAllTracksForUser } from "../../lib/actions";
import TrackCard from "@/components/TrackCard";
import RoomMapImage from "@/public/room-map.png";
import TrackList from "@/components/TrackList";

export const dynamic = 'force-dynamic'

export default async function Home() {

  const session = await auth();

  const userId = session?.user?.id ?? "";
  // TODO: create hook to hadle states and loading

  return (
    <SessionProvider session={session}>
      <main className="flex flex-col items-center justify-between p-4 sm:p-24 sm:pt-8 sm:pb-8">

        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-2/3 after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert lg:max-w-2xl"
            src={RoomMapImage}
            alt="Bouldering map"
            width={680}
            height={300}
            priority
          />
        </div>

        {userId ? (
          <TrackList userId={userId}/>
        ) : (
          <div className="bg-red-900 border border-red-500 rounded p-4">
            <p className="text-red-300">Error, sign in to see your tracks...</p>
          </div>
        )}

      </main>
    </SessionProvider>
  );
}
