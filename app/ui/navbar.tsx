// Assuming 'auth' is a custom hook or function to get the session. You may need to adjust this
// to use appropriate hooks or context providers for session management.
import React, { useEffect, useState } from 'react';
import SignInButton from './signin.button';
import { SessionProvider, useSession } from 'next-auth/react';
import { auth } from '@/auth';
import UserMenu from './usermenu';

export default async function NavBar() {
  //const [session, setSession] = useState(null);
  const session = await auth();
  if (session?.user) {
    // filter out sensitive data before passing to client.
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
    console.log(session);
  }

  return (
    <SessionProvider session={session}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <div>Logo</div>
        <div>
          {session ? (
            <UserMenu />
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>
    </SessionProvider>

  );
};


