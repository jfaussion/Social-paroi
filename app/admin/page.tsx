import { auth } from "@/auth";
import TrackForm from "@/components/TrackForm";
import { SessionProvider } from "next-auth/react";

export default async function AdminPage() {
  const session = await auth();

  return (
    <>
      <SessionProvider session={session}>
        <main className="flex flex-col items-center justify-between p-4 sm:p-24 sm:pt-8 sm:pb-8">
          {/*@ts-ignore*/}
          {session?.user?.role === 'admin' ? (
            <div>
              <p>You are an admin, welcome!</p>
              <TrackForm userId={session?.user?.id} />
            </div>
          ) : (
            <p>You are not an admin.</p>
          )}
        </main>
      </SessionProvider>
    </>
  );
}