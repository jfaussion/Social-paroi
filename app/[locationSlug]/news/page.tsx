
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { isConnected } from "@/utils/session.utils";
import NewsList from "@/components/news/NewsList";
import { getLocationBySlug } from "@/lib/locations/actions/getLocationBySlug";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic'

export default async function News({ params }: { params: Promise<{ locationSlug: string }> }) {
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
                News
              </span>
              <NewsList locationId={location.id} />
            </div>
          </div>
        )}
      </main>
    </SessionProvider>
  );
}
