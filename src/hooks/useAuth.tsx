import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface User {
  id: string;
  email: string;
  user_metadata: { display_name?: string };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: "mock-user-001",
  email: "demo@dialora.ai",
  user_metadata: { display_name: "Demo User" },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    return localStorage.getItem("dialora_auth") ? MOCK_USER : null;
  });
  const [loading] = useState(false);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    if (!email || !password) return { error: new Error("Email and password required") };
    localStorage.setItem("dialora_auth", "true");
    setUser({ ...MOCK_USER, email, user_metadata: { display_name: name || email.split("@")[0] } });
    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!email || !password) return { error: new Error("Email and password required") };
    localStorage.setItem("dialora_auth", "true");
    setUser({ ...MOCK_USER, email, user_metadata: { display_name: email.split("@")[0] } });
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem("dialora_auth");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
