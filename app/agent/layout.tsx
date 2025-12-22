'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { api }from '@/src/services/apiClient'


  export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/agent/login';

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Login page never requires auth
    if (isLoginPage) {
      setIsChecking(false);
      return;
    }

    let cancelled = false;

    const verifyAuth = async () => {
      try {
        const res = await api.get('/auth/me');

        if (
          !res?.data?.success ||
          !res.data.user ||
          res.data.user.role !== 'AGENT'
        ) {
          if (!cancelled) {
            router.replace('/agent/login');
          }
          return;
        }

        if (!cancelled) {
          setIsAuthorized(true);
        }
      } catch (err) {
        if (!cancelled) {
          router.replace('/agent/login');
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    };

    verifyAuth();

    return () => {
      cancelled = true;
    };
  }, [isLoginPage, router]);

  // While auth is being verified, render nothing (or spinner)
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-500 text-sm">Checking authentication…</span>
      </div>
    );
  }

  // If not authorized, layout already redirected
  if (!isAuthorized && !isLoginPage) {
    return null;
  }

  return <>{children}</>;
}

  