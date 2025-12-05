import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { useEffect, useState } from "react";
import GoogleSignInButton from "../../components/GoogleSignInButton";

const LoginPage = () => {
  const { user, loading } = useAuth(); // Obtén los datos del usuario y el estado de carga
  const navigate = useNavigate(); // Usamos el hook para redirigir
  const [redirected, setRedirected] = useState(false); // Estado local para evitar redirecciones múltiples

  useEffect(() => {
    if (user && !loading && user?.role && !redirected) {
      // Redirigir según el rol del usuario
      if (user.role === "admin") {
        navigate("/admin"); // Redirigir al admin
      } else if (user.role === "kiosk") {
        //");
        navigate("/kiosk"); // Redirigir al cliente
      } else {
        navigate("/"); // Redirigir a la página principal si no tiene un rol específico
      }

      // Establecer el flag para evitar futuras redirecciones
      setRedirected(true);
    }
  }, [user, navigate, loading, redirected]); // Asegúrate de agregar "redirected" en las dependencias

  if (loading) {
    return <div>Cargando...</div>; // Carga inicial mientras se obtiene la información del usuario
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        {JSON.stringify(user)}
        <GoogleSignInButton onLogin={(data) => {
          console.log("Usuario logueado", data); // Para debug, puedes quitar esta línea
        }} />

        {/* Aquí puedes agregar un mensaje o redirigir si el login falla */}
      </div>
    </div>
  );
};

export default LoginPage;
