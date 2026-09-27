import { useState, useCallback } from "react";
import { api } from "../../utils/api";
import { UserAuthData } from "../../types/builder.types";

const AUTH_STORAGE_KEY = "ui_builder_auth_user";

export function useAuth() {
  const [user, setUser] = useState<UserAuthData | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as UserAuthData) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post<{
          token: string;
          user: { id: number; email: string; role: string };
        }>("/users/auth/login", { email, password });

        const authData: UserAuthData = {
          id: res.user.id,
          email: res.user.email,
          role: res.user.role,
          token: res.token,
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        setUser(authData);
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Invalid credentials";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
  };
}
