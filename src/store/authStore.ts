import { create } from "zustand";
import type { AuthStatus, User } from "@/types/auth";

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  setUser: (user) =>
    set((state) => (state.user === user ? state : { ...state, user })),
  setStatus: (status) =>
    set((state) => (state.status === status ? state : { ...state, status })),
  logout: () =>
    set({
      user: null,
      status: "unauthenticated",
    }),
}));
