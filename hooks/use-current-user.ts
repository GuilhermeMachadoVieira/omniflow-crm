"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "@/lib/types";

interface UserStore {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const useCurrentUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "omniflow-user",
    }
  )
);
