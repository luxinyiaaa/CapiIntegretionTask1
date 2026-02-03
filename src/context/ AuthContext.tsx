import { useState, type ReactNode } from "react";
import { AuthContext } from "@/context/auth";
type User = {
  email: string;
  password: string;
} | null;

// type AuthContextType = {
//   user: User;
//   login: (email: string, password: string) => boolean;
//   register: (
//     name: string,
//     email: string,
//     password: string,
//     phone: string,
//     dob: string
//   ) => boolean;
//   logout: () => void;
// };
// export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const register = (email: string, password: string) => {
    setUser({ email, password });
    return true;
  };

  const login = (email: string, password: string) => {
    if (email === "123@we.com" && password === "1234") {
      setUser({ email, password });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
