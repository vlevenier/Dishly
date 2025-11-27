import { createContext, useEffect, useState, useCallback, useRef } from "react";
import { loginWithGoogle, getProfile, refreshToken } from "../services/Auth";
import axiosInstance from "../helpers/AxiosInstance";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Guardamos el intervalo para cancelarlo en logout
  const refreshIntervalRef = useRef(null);

  // -----------------------
  // LOGIN con Google
  // -----------------------
  const login = async (id_token) => {
    const data = await loginWithGoogle(id_token);

    setUser(data.user);
    setAccessToken(data.accessToken);
    window.__accessToken = data.accessToken; // correcto

    return data;
  };

  // -----------------------
  // LOGOUT
  // -----------------------
  const logout = async () => {
    try {
    await axiosInstance.post("/auth/logout", {}, { withCredentials: true });

    } catch (err) {
      console.warn("Logout error (ignored):", err);
    }

    // Muy importante → detiene auto-refresh
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    setUser(null);
    setAccessToken(null);
    window.__accessToken = null;
  };

  // -----------------------
  // REFRESH token
  // -----------------------
  const refresh = useCallback(async () => {
    try {
      const data = await refreshToken();

      setAccessToken(data.accessToken);
      window.__accessToken = data.accessToken;

      return data.accessToken;
    } catch {
      setUser(null);
      setAccessToken(null);
      return null;
    }
  }, []);

  // -----------------------
  // CARGA INICIAL
  // -----------------------
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const newAccess = await refresh();
        if (!newAccess) throw new Error("No refresh token");

        const profile = await getProfile();

        if (mounted) {
          setUser(profile.user);
          setAccessToken(newAccess);
          window.__accessToken = newAccess;
        }
      } catch {
        if (mounted) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => (mounted = false);
  }, [refresh]);

  // -----------------------
  // AUTO REFRESH cada 10 min
  // -----------------------
  useEffect(() => {
    refreshIntervalRef.current = setInterval(() => {
      refresh();
    }, 10 * 60 * 1000);

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
