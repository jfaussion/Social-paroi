'use client'

import { signIn } from "next-auth/react";

export default function SignInWithProviverButton(
  { provider }: Readonly<{ provider: string }>
) {

  return (
    <div>
      <button onClick={() => signIn(provider)}>Log in with { provider }</button>
    </div>
  );

}