import { auth } from "@/auth";
import TrackForm from "@/components/TrackForm";
import { isOpener } from "@/utils/session.utils";
import { SessionProvider } from "next-auth/react";

export default async function OpenerPage() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <main className="flex flex-col items-center justify-between p-4 sm:p-24 sm:pt-4 sm:pb-4">
        {isOpener(session) ? (
          <div className="w-full max-w-2xl items-center ">
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold w-full p-4 pt-0">
                Create a new block
              </span>
              <TrackForm userId={session?.user?.id} />
            </div>
          </div>
        ) : (
          <p>This page is restricted to opener only.</p>
        )}
      </main>
    </SessionProvider>
  );
}