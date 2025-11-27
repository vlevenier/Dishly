// api.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 🔥 cookies httpOnly viajan SIEMPRE
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------- REQUEST INTERCEPTOR -----------
axiosInstance.interceptors.request.use(
  (config) => {
    // el AuthProvider manejará el accessToken, no localStorage
    const accessToken = window.__accessToken;

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----------- RESPONSE INTERCEPTOR -----------
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // NO borramos nada aquí
      // El AuthProvider se encargará de reintentar refresh
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
