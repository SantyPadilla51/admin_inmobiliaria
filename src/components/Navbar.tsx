const Navbar = () => {
  const closeSession = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 shrink-0 shadow-sm sticky top-0 z-50">
        {/* Sección Izquierda: Título y Subtítulo */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 "></span>
            Inmobiliaria Panel
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5 ml-4">
            Gestiona tus propiedades y publicaciones
          </p>
        </div>

        <button
          onClick={closeSession}
          className="flex hover:cursor-pointer items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Cerrar sesión
        </button>
      </header>
    </>
  );
};

export default Navbar;
