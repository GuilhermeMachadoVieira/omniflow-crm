"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { AuthUser } from "@/lib/types";

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { setUser } = useCurrentUser();

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const rawUser = data.user as any | null;

          if (rawUser) {
            const mappedUser: AuthUser = {
              id: rawUser.id,
              email: rawUser.email || "",
              nome: rawUser.nome || rawUser.name || "",
              role: rawUser.role,
              organizationId: rawUser.organizationId,
              orgName: rawUser.orgName,
              image: rawUser.image ?? null,
            };

            setUser(mappedUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      }
    }

    loadUser();
  }, [setUser]);

  return <>{children}</>;
}
