'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { getAccessToken } from '@/lib/auth-token-storage';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (getAccessToken()) {
      router.replace('/');
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {children}
    </div>
  );
}
