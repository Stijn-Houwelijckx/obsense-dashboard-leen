import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createExpiringStorage } from "../hooks/useExpiringStorage";

const STORAGE_NAME = "authStorage";
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

export const useAuthStorage = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() => createExpiringStorage(EXPIRATION_TIME)),
    }
  )
);
