'use client'

import { signIn } from "next-auth/react";

export default function SignInWithProviverButton(
  { provider, providerName, providerImageLight, providerImageDark }: Readonly<{ provider: string, providerName: string, providerImageLight: string, providerImageDark: string }>
) {
  return (
    <button
      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 flex items-center justify-center space-x-3 text-gray-800 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 transition-colors"
      onClick={() => signIn(provider)}
    >
      <img src={providerImageLight} alt={`${providerName} Icon`} className="w-5 h-5 dark:hidden" />
      <img src={providerImageDark} alt={`${providerName} Icon`} className="w-5 h-5 hidden dark:block" />
      <span className="text-sm font-medium">Continue with {providerName}</span>
    </button>
  );
}