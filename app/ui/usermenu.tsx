"use client"

import { signOut, useSession } from "next-auth/react";

export default function UserMenu() {
  const { data: session, status } = useSession()

  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}>
      {session ? (
        <div style={{backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      ) : (
        <div>Sign in</div>
      )}
    </div>
  );
};

function handleSignOut() {
  signOut()
}