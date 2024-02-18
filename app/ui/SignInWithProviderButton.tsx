'use client'

import { signIn } from "next-auth/react";

export default function SignInWithProviverButton(
  { provider, providerName, providerImage }: Readonly<{ provider: string, providerName: string, providerImage: string }>
) {

  return (
    <div>
      <button
        className="bg-gray-800 text-white rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-700"
        onClick={() => signIn(provider)}
      >
        <img src={providerImage} alt={`${providerName} Icon`} className="w-5 h-5" />
        <span>Sign in with {providerName}</span>
      </button>
    </div>
  );

}