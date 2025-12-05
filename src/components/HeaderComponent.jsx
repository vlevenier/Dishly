import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const Header = () => {
  const { user, logout, role } = useAuth(); // Accedemos al contexto de autenticación

  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mi App</h1>

          <nav className="flex gap-6">
            {/* Enlaces visibles para todos */}
            <NavLink to="/" className="hover:text-gray-300">
              Inicio
            </NavLink>

            {/* Enlaces visibles solo para admins */}
            {role === "admin" && (
              <>
                <NavLink to="/admin/orders" className="hover:text-gray-300">
                  Gestión de Pedidos
                </NavLink>
                <NavLink to="/admin/products" className="hover:text-gray-300">
                  Gestión de Productos
                </NavLink>
                <NavLink to="/admin/ingredients" className="hover:text-gray-300">
                  Gestión de Ingredientes
                </NavLink>
                <NavLink to="/admin/categories" className="hover:text-gray-300">
                  Gestión de Categorías
                </NavLink>
                <NavLink to="/admin/invoices" className="hover:text-gray-300">
                  Facturas
                </NavLink>
              </>
            )}

            {/* Enlaces visibles solo para clientes o kiosks */}
            {role === "client" && (
              <NavLink to="/kiosk" className="hover:text-gray-300">
                Kiosco
              </NavLink>
            )}

            {/* Si el usuario está autenticado, muestra el botón de logout */}
            {user ? (
              <button
                onClick={logout}
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            ) : (
              <NavLink to="/login" className="hover:text-gray-300">
                Login
              </NavLink>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
