export type UserRole = "user" | "admin" | string;

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  created_at: string;
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

