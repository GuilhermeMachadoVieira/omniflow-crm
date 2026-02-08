"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { hasAuthCookie } from "@/lib/auth";

const LOGIN_PATH = "/login";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Protege rotas privadas no cliente: se o cookie de auth não existir
 * (ex.: usuário apagou após carregar a página), redireciona para o login.
 * A proteção principal é feita pelo middleware; este componente evita
 * uso indevido após carregamento.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === LOGIN_PATH) return;
    if (!hasAuthCookie()) {
      router.replace(LOGIN_PATH);
    }
  }, [pathname, router]);

  return <>{children}</>;
}
