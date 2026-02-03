import { createContext } from "react";

type User = {
  email: string;
  password: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => boolean;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string,
    dob: string,
  ) => boolean;
  logout: () => void;
};
export const AuthContext = createContext<AuthContextType | null>(null);
