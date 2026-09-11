import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { demoUser } from "@/data/demo";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = window.localStorage.getItem("sf_user");
      return saved ? (JSON.parse(saved) as User) : null;
    } catch {
      window.localStorage.removeItem("sf_user");
      return null;
    }
  });

  const login = useCallback((email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const savedPassword = window.localStorage.getItem("sf_password") || "admin123";
    if (trimmedEmail === "admin@stockflow.com" && password === savedPassword) {
      let currentUser = demoUser;
      try {
        const saved = window.localStorage.getItem("sf_user");
        if (saved) {
          currentUser = JSON.parse(saved);
        }
      } catch {
        // fallback to demoUser
      }
      setUser(currentUser);
      window.localStorage.setItem("sf_user", JSON.stringify(currentUser));
      return { success: true };
    }
    return { success: false, error: "Invalid email or password." };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem("sf_user");
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      window.localStorage.setItem("sf_user", JSON.stringify(next));
      return next;
    });
  }, []);

  const changePassword = useCallback((currentPassword: string, newPassword: string) => {
    const savedPassword = window.localStorage.getItem("sf_password") || "admin123";
    if (currentPassword !== savedPassword) return { success: false, error: "Current password is incorrect." };

    window.localStorage.setItem("sf_password", newPassword);
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
