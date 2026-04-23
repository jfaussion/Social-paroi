import { auth } from "@/auth";
import RankingList from "@/components/users/RankingList";
import { getLocationBySlug } from "@/lib/locations/actions/getLocationBySlug";
import { isConnected } from "@/utils/session.utils";
import { notFound } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function RankingPage({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const location = await getLocationBySlug(locationSlug);

  if (!location) notFound();

  const session = await auth();

  return (
    <SessionProvider session={session}>
      <main className="flex flex-col items-center justify-between p-4 sm:p-24 sm:pt-4 sm:pb-4">
        {isConnected(session) && (
          <div className="w-full max-w-2xl items-center ">
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold w-full p-4 pt-0">
                Ranking
              </span>
              <RankingList locationId={location.id} />
            </div>
          </div>
        )}
      </main>
    </SessionProvider>
  );
}