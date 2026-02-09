"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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

  useEffect(() => {
    // Verificação simples de cookie
    if (pathname === LOGIN_PATH) return;
    
    const hasCookie = document.cookie.includes("omniflow-auth=");
    console.log("AuthGuard - pathname:", pathname, "hasCookie:", hasCookie);
    console.log("AuthGuard - all cookies:", document.cookie);
    
    if (!hasCookie) {
      console.log("AuthGuard - Redirecting to login");
      router.replace(LOGIN_PATH);
    }
  }, [pathname, router]);

  return <>{children}</>;
}
