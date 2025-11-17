// AuthContext.tsx
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import env from "../config/env";
import { User } from "../types/User";

export interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null, persist?: boolean) => void;
  user: User | null;
  setUser: (user: User | null, persist?: boolean) => void;
  loading: boolean;
  refreshToken: () => Promise<void>;
}

export interface RefreshResponse {
  accessToken: string;
  accessTokenExpiresUtc: string;       // DateTime -> string (ISO)
  user: User;
  returnUrl?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_KEY = "access_token";
const USER_KEY = "user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, _setAccessToken] = useState<string | null>(null);
  const [user, _setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // helper set và lưu vào localStorage nếu persist = true
  const setAccessToken = (token: string | null, persist = true) => {
    _setAccessToken(token);
    if (persist) {
      if (token) localStorage.setItem(ACCESS_KEY, token);
      else localStorage.removeItem(ACCESS_KEY);
    }
  };

  const setUser = (u: User | null, persist = true) => {
    _setUser(u);
    if (persist) {
      if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
      else localStorage.removeItem(USER_KEY);
    }
  };

  // gọi API refresh
  const refreshToken = async () => {
    try {
      const res = await fetch(`${env.API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        setAccessToken(null);
        setUser(null);
        return;
      }

      const data: Partial<RefreshResponse> = await res.json();
      setAccessToken(data.accessToken ?? null);
      setUser(data.user ?? null);
    } catch {
      setAccessToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    // 1️⃣ Kiểm tra localStorage trước
    const token = localStorage.getItem(ACCESS_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (token && userStr) {
      _setAccessToken(token);
      _setUser(JSON.parse(userStr));
      setLoading(false);
      return;
    }

    // 2️⃣ Nếu không có token, gọi refresh
    refreshToken().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 500,
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser, loading, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// hook tiện lợi
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
