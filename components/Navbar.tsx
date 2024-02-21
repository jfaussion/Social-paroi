import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import Image from 'next/image';
import UserMenu from './UserMenu';
import SignIn from './ui/signIn';

export default async function NavBar() {
  const session = await auth();
  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
  }

  return (
    <SessionProvider session={session}>
      <nav className="sticky flex justify-center border-b">
        <div className="flex items-center justify-between w-full h-16 max-w-3xl px-4 mx-auto sm:px-6">
          <Image src="/social-paroi.png" alt="Social Paroi app logo" width={40} height={40} />
          <div>
            {session ? (
              <UserMenu />
            ) : (
              <SignIn />
            )}
          </div>
        </div>
      </nav>
    </SessionProvider>
  );
};


