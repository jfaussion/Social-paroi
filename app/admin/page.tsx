import { auth } from "@/auth";
import TrackForm from "@/components/TrackForm";
import { AdapterUserCustom } from "@/lib/AdapterUserCustom";
import { SessionProvider } from "next-auth/react";

export default async function AdminPage() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <main className="flex flex-col items-center justify-between p-4 sm:p-24 sm:pt-4 sm:pb-4">
        {(session?.user as AdapterUserCustom)?.role === 'admin' ? (
          <div className="w-full max-w-2xl items-center ">
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold w-full p-4 pt-0">
                Create a new block
              </span>
              <TrackForm userId={session?.user?.id} />
            </div>
          </div>
        ) : (
          <p>This page is restricted to admin only.</p>
        )}
      </main>
    </SessionProvider>
  );
}