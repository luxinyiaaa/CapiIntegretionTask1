import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { AuthContext } from "@/context/auth";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
      } else {
        setToken(null);
      }

      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function syncSession(firebaseUser: User | null) {
    setUser(firebaseUser);
    if (firebaseUser) {
      const idToken = await firebaseUser.getIdToken();
      setToken(idToken);
    } else {
      setToken(null);
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await syncSession(cred.user);
    return true;
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      phone: string,
      dob: string,
    ) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      if (name) {
        try {
          await updateProfile(cred.user, { displayName: name });
        } catch (error) {
          console.error("updateProfile failed:", error);
        }
      }

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        name: name.trim(),
        email: cred.user.email,
        phone: phone.trim(),
        dob: dob.trim(),
        createdAt: serverTimestamp(),
      });

      await syncSession(cred.user);
      return true;
    },
    [],
  );

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthed: !!user,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
