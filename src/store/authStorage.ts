import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createExpiringStorage } from "../hooks/useExpiringStorage";
import type { User } from "../types/user.types"; // pas dit pad aan als nodig

const STORAGE_NAME = "authStorage";
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStorage = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() => createExpiringStorage(EXPIRATION_TIME)),
    }
  )
);
