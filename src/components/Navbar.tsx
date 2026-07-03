import { Link } from "react-router-dom";

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

        {/* Sección Derecha: Botones de Acción */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Botón: Propiedades */}
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-200 transition-all duration-200 group active:scale-95"
          >
            <svg
              className="h-4 w-4 text-slate-500 group-hover:text-slate-700 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Propiedades
          </Link>

          {/* Botón: Agregar + */}
          <Link
            to="/admin/add-prop"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm shadow-blue-600/10 hover:shadow-md hover:shadow-blue-600/20 transition-all duration-200 active:scale-95"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Agregar Nueva
          </Link>

          {/* Separador visual sutil */}
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

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
        </div>
      </header>
    </>
  );
};

export default Navbar;
