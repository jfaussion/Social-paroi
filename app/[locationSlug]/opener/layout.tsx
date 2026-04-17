import { auth } from "@/auth";
import { isOpener } from "@/utils/session.utils";
import { SessionProvider } from "next-auth/react";

export default async function OpenerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <main className="flex flex-col items-center justify-between p-4 sm:p-24 sm:pt-4 sm:pb-4">
        {isOpener(session) ? (
          children
        ) : (
          <p>This page is restricted to opener only.</p>
        )}
      </main>
    </SessionProvider>
  );
}
