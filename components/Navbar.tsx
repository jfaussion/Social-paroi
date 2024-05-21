import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import UserMenu from './UserMenu';
import SignIn from './ui/signIn';
import Drawer from './Drawer';

export default async function NavBar() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <nav className="sticky z-20 flex justify-center border-b border-gray-400 dark:border-gray-700">
        <div className="flex items-center justify-between w-full h-16 px-4 mx-auto sm:px-6">
          <Drawer />
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


