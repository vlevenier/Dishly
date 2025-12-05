import { createContext, useEffect, useState, useCallback, useRef } from "react";
import { loginWithGoogle, getProfile, refreshToken } from "../services/Auth";
import axiosInstance from "../helpers/AxiosInstance";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);  // Nuevo estado para el role

  const refreshIntervalRef = useRef(null);

  const login = async (id_token) => {
    const data = await loginWithGoogle(id_token);

    setUser(data.user);
    setAccessToken(data.accessToken);
    setRole(data.user.role); // Asumimos que el API devuelve el role del usuario

    window.__accessToken = data.accessToken;

    return data;
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });

    } catch (err) {
      console.warn("Logout error (ignored):", err);
    }

    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    setUser(null);
    setAccessToken(null);
    setRole(null); // Limpiamos el role
    window.__accessToken = null;
  };

  const refresh = useCallback(async () => {
    try {
      const data = await refreshToken();
      setAccessToken(data.accessToken);
      window.__accessToken = data.accessToken;

      return data.accessToken;
    } catch {
      setUser(null);
      setAccessToken(null);
      setRole(null); // Limpiamos el role
      return null;
    }
  }, []);

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
          setRole(profile.user.role); // Asumimos que el role viene en el perfil
          window.__accessToken = newAccess;
        }
      } catch {
        if (mounted) {
          setUser(null);
          setAccessToken(null);
          setRole(null); // Limpiamos el role
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => (mounted = false);
  }, [refresh]);

  useEffect(() => {
    refreshIntervalRef.current = setInterval(() => {
      refresh();
    }, 10 * 60 * 1000);

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [refresh]);

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      loading,
      role,  // Proveemos el role a los componentes
      login,
      logout,
      refresh,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
