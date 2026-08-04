import { useState, type FormEvent } from "react";
import { X, User, Phone, Mail, Building2, Search, FileText } from "lucide-react";
import { updateContacto } from "@/services/contactos/updateContacto";
import type { Cliente, RolesCliente } from "@/interfaces/Cliente";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface EditarClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
  setClienteSeleccionado: (cliente: Cliente | null) => void;
}

const getInitialFormData = (cliente: Cliente | null) => ({
  id: cliente?.id || "",
  nombre: cliente?.nombre || "",
  email: cliente?.email || "",
  telefono: cliente?.telefono || "",
  notas: cliente?.notas || "",
  roles: cliente?.roles || { esPropietario: false, esBuscador: false },
  busqueda: cliente?.busqueda || {
    tipoOperacion: "venta" as const,
    tipoPropiedad: "Departamento" as const,
    presupuestoMax: "",
    zonas: "",
  },
});

export const EditarClienteModal = ({ isOpen, onClose, cliente, setClienteSeleccionado }: EditarClienteModalProps) => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Estados del formulario
  const [formData, setFormData] = useState(() => getInitialFormData(cliente));

  if (!isOpen || !cliente) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: keyof RolesCliente) => {
    setFormData((prev) => ({
      ...prev,
      roles: {
        ...prev.roles!,
        [role]: !prev.roles?.[role],
      },
    }));
  };

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      busqueda: {
        ...prev.busqueda!,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const response = await updateContacto(formData, queryClient, setCargando);

      if (response.ok === true) {
        onClose();
        setClienteSeleccionado(null);
      }
    } catch {
      toast.error("Error al actualizar la información del cliente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Editar Cliente</h2>
            <p className="text-xs text-slate-500">Actualiza los datos personales, roles y preferencias.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">{error}</div>}

          {/* Información Personal */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Información Básica</span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Nombre completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Teléfono</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    placeholder="Ej. +54 11 1234-5678"
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Roles del Cliente */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Roles del Cliente</span>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.roles?.esPropietario
                    ? "bg-teal-50/50 border-teal-200 text-teal-900"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.roles?.esPropietario || false}
                  onChange={() => handleRoleChange("esPropietario")}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-medium">Es Propietario</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.roles?.esBuscador
                    ? "bg-teal-50/50 border-teal-200 text-teal-900"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.roles?.esBuscador || false}
                  onChange={() => handleRoleChange("esBuscador")}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-medium">Es Buscador</span>
                </div>
              </label>
            </div>
          </div>

          {/* Preferencias de Búsqueda (Condicional al rol esBuscador) */}
          {formData.roles?.esBuscador && (
            <div className="space-y-3 p-4 bg-teal-50/30 border border-teal-100/80 rounded-xl">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                Preferencias de Búsqueda
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Operación</label>
                  <select
                    name="tipoOperacion"
                    value={formData.busqueda?.tipoOperacion}
                    onChange={handleBusquedaChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  >
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Tipo de Inmueble</label>
                  <select
                    name="tipoPropiedad"
                    value={formData.busqueda?.tipoPropiedad}
                    onChange={handleBusquedaChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  >
                    <option value="Departamento">Departamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Ph">PH</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Local">Local</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Presupuesto Máximo</label>
                  <input
                    type="text"
                    name="presupuestoMax"
                    value={formData.busqueda?.presupuestoMax}
                    onChange={handleBusquedaChange}
                    placeholder="Ej. USD 120.000"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Zonas de Interés</label>
                  <input
                    type="text"
                    name="zonas"
                    value={formData.busqueda?.zonas}
                    onChange={handleBusquedaChange}
                    placeholder="Ej. Palermo, Belgrano"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notas */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Notas Adicionales</span>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                name="notas"
                rows={3}
                value={formData.notas}
                onChange={handleChange}
                placeholder="Escribe comentarios relevantes del cliente..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-xl transition-all shadow-sm shadow-teal-200 cursor-pointer"
            >
              {cargando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
