import {
  CalendarDays,
  Handshake,
  House,
  MessageSquareText,
  Plus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export const SideBar = () => {
  return (
    <div className="flex flex-col  w-64 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm/50 gap-6">
      {/* SECCIÓN PRINCIPAL */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase px-2 mb-1">
          Catálogo
        </span>

        <Link
          to="/admin/propiedades"
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-200 transition-all duration-200"
        >
          <House size={15} />
          Mis Propiedades
        </Link>

        <Link
          to="/admin/add-prop"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200"
        >
          <Plus size={15} />
          Agregar Nueva
        </Link>
      </div>

      {/* SECCIÓN OPERACIONES */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase px-2 mb-1">
          Operaciones
        </span>

        <Link
          to="/admin/consultas"
          className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
        >
          <MessageSquareText size={15} />
          Consultas Recibidas
        </Link>

        <Link
          to="/admin/agenda"
          className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
        >
          <CalendarDays size={15} />
          Agenda de Visitas
        </Link>
      </div>

      {/* SECCIÓN ADMINISTRACIÓN */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase px-2 mb-1">
          Administración
        </span>

        <Link
          to="/admin/clientes"
          className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
        >
          <Users size={15} />
          Clientes y Propietarios
        </Link>

        <Link
          to="/admin/contratos"
          className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
        >
          <Handshake size={15} />
          Contratos Activos
        </Link>
      </div>
    </div>
  );
};
