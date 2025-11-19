const Footer = () => {
  return (
 <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Acerca de</h3>
            <p className="text-gray-400 text-sm">
              Información sobre tu empresa o proyecto.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="text-sm">
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white">Términos de uso</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white">Política de privacidad</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociales</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Mi App. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;