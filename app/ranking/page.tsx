import { auth } from "@/auth";
import RankingList from "@/components/users/RankingList";
import { isConnected } from "@/utils/session.utils";
import { SessionProvider } from "next-auth/react";

export default async function RankingPage() {
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
              <RankingList />
            </div>
          </div>
        )}
      </main>
    </SessionProvider>
  );
}