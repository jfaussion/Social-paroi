import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import Image from 'next/image';
import UserMenu from './UserMenu';
import SignIn from './ui/signIn';
import Logo from '@/public/social-paroi.png';

export default async function NavBar() {
  const session = await auth();
  if (session?.user) {
    session.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
  }

  return (
    <SessionProvider session={session}>
      <nav className="sticky flex justify-center border-b border-gray-700">
        <div className="flex items-center justify-between w-full h-16 max-w-3xl px-4 mx-auto sm:px-6">
          <Image src={Logo} alt="Social Paroi app logo" width={40} height={40} />
          <div className="text-4xl md:text-5xl font-extrabold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Social Paroi
            </span>
          </div>
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


