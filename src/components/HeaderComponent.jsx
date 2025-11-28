import { NavLink } from "react-router-dom";

const Header = () => {
  return (
     <header className="bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mi App</h1>
          <nav className="flex gap-6">
                <NavLink to="/">inicio</NavLink>
                <NavLink to="/admin/orders">Gestión de Pedidos</NavLink>
                <NavLink to="/admin/products">Gestión de Productos</NavLink>
                <NavLink to="/admin/categories">Gestión de Categorias</NavLink>
                <NavLink to="/admin/invoices">Facturas</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};


export default Header;