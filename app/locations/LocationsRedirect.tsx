'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LocationsRedirectProps {
  redirectTo: string;
}

export function LocationsRedirect({ redirectTo }: LocationsRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(redirectTo);
  }, [router, redirectTo]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500 dark:text-gray-400">Redirecting...</p>
    </div>
  );
}