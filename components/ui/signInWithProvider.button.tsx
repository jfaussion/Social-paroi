'use client'

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SignInWithProviverButton(
  { provider, providerName, providerImageLight, providerImageDark }: Readonly<{ provider: string, providerName: string, providerImageLight: string, providerImageDark: string }>
) {
  const [providerImageSrc, setProviderImageSrc] = useState(providerImageLight);

  useEffect(() => {
    const updateImageForColorScheme = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setProviderImageSrc(providerImageDark);
      } else {
        setProviderImageSrc(providerImageLight);
      }
    };
    updateImageForColorScheme();
    window.matchMedia('(prefers-color-scheme: dark)').addListener(updateImageForColorScheme);
    // Clean up listener on component unmount
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeListener(updateImageForColorScheme);
    };
  }, [providerImageDark, providerImageLight]);

  return (
    <div>
      <button
        className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-700"
        onClick={() => signIn(provider)}
      >
        <img src={providerImageSrc} alt={`${providerName} Icon`} className="w-5 h-5" />
        <span>Sign in with {providerName}</span>
      </button>
    </div>
  );

}