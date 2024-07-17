
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { isConnected, isOpener } from "@/utils/session.utils";
import NewsList from "@/components/NewsList";

export const dynamic = 'force-dynamic'

export default async function News() {

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
              <NewsList/>
            </div>
          </div>
        )}
      </main>
    </SessionProvider>
  );
}
