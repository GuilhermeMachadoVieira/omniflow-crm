"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { AuthUser } from "@/lib/types";

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
          setUser(data.user);
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
