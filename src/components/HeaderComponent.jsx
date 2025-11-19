const Header = () => {
  return (
     <header className="bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mi App</h1>
          <nav className="flex gap-6">
            <a href="#" className="hover:underline">Inicio</a>
            <a href="#" className="hover:underline">Productos</a>
            <a href="#" className="hover:underline">Servicios</a>
            <a href="#" className="hover:underline">Contacto</a>
          </nav>
        </div>
      </div>
    </header>
  );
};


export default Header;