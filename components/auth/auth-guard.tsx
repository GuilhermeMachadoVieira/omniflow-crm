"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const LOGIN_PATH = "/login";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Proteção simples de rotas no cliente.
 * A proteção principal é feita pelo middleware.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();

  useEffect(() => {
    if (pathname === LOGIN_PATH) return;

    if (status === "unauthenticated") {
      router.replace(LOGIN_PATH);
    }
  }, [pathname, router, status]);

  return <>{children}</>;
}
