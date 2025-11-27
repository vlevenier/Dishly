// components/GoogleSignInButton.jsx
import React, { useEffect } from "react";
import { useAuth } from "../auth/useAuth";

export default function GoogleSignInButton({ onLogin }) {
  const { login } = useAuth();

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const initializeGoogle = () => {
      /* global google */
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large" }
      );
    };

    // si google ya está cargado
    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      window.onload = () => {
        if (window.google?.accounts?.id) {
          initializeGoogle();
        }
      };
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    const id_token = response.credential;

    try {
      const data = await login(id_token); // usa tu AuthProvider

      // callback opcional del padre
      if (onLogin) onLogin(data);
    } catch (e) {
      console.error("Error en login con Google", e);
    }
  };

  return <div id="google-signin-btn"></div>;
}
