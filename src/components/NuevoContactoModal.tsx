import React, { useState } from "react";
import { X, User, Phone, Mail, Building2, Search, Tag, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createContacto } from "@/services/contactos/createContacto";
import { useQueryClient } from "@tanstack/react-query";

interface NuevoContactoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ContactoFormData {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  origen: string;
  roles: {
    esPropietario: boolean;
    esBuscador: boolean;
  };
  busqueda?: {
    tipoOperacion: "venta" | "alquiler";
    tipoPropiedad: string;
    presupuestoMax: number | "";
    zonas: string;
  };
  notas: string;
}

export const NuevoContactoModal: React.FC<NuevoContactoModalProps> = ({ isOpen, onClose }) => {
  const [cargando, setCargando] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ContactoFormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    origen: "Zonaprop",
    roles: {
      esPropietario: false,
      esBuscador: false,
    },
    busqueda: {
      tipoOperacion: "venta",
      tipoPropiedad: "Departamento",
      presupuestoMax: "",
      zonas: "",
    },
    notas: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createContacto(formData, setCargando, queryClient);

      onClose();
    } catch {
      toast.error("Error al crear el contacto:");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Contacto</h2>
            <p className="text-xs text-gray-500">Agregá un cliente a tu cartera y vinculá sus intereses.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECCIÓN 1: Roles / Tipo de Cliente */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Tipo de Contacto *</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                  formData.roles.esBuscador
                    ? "border-blue-600 bg-blue-50/50 text-blue-700 font-medium"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.roles.esBuscador}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setFormData({
                      ...formData,
                      roles: {
                        esBuscador: isChecked,
                        esPropietario: isChecked ? false : formData.roles.esPropietario,
                      },
                    });
                  }}
                />
                <Search className="w-4 h-4" />
                <span>Buscador / Interesado</span>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                  formData.roles.esPropietario
                    ? "border-blue-600 bg-blue-50/50 text-blue-700 font-medium"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.roles.esPropietario}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setFormData({
                      ...formData,
                      roles: {
                        esPropietario: isChecked,
                        esBuscador: isChecked ? false : formData.roles.esBuscador,
                      },
                    });
                  }}
                />
                <Building2 className="w-4 h-4" />
                <span>Propietario</span>
              </label>
            </div>
          </div>

          {/* SECCIÓN 2: Datos Personales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Nombre *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Apellido *</label>
              <input
                type="text"
                required
                placeholder="Ej. Pérez"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Teléfono / WhatsApp *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  required
                  placeholder="+54 9 11..."
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="juan@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Requisitos de Búsqueda (Condicional si es Buscador) */}
          {formData.roles.esBuscador && (
            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Criterios de Búsqueda Inicial
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Operación</label>
                  <select
                    value={formData.busqueda?.tipoOperacion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        busqueda: {
                          ...formData.busqueda!,
                          tipoOperacion: e.target.value as "venta" | "alquiler",
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Inmueble</label>
                  <select
                    value={formData.busqueda?.tipoPropiedad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        busqueda: {
                          ...formData.busqueda!,
                          tipoPropiedad: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="Departamento">Departamento</option>
                    <option value="Casa">Casa</option>
                    <option value="PH">PH</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Local">Local</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Presupuesto Máx. (USD)</label>
                  <input
                    type="number"
                    placeholder="Ej. 120000"
                    value={formData.busqueda?.presupuestoMax}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        busqueda: {
                          ...formData.busqueda!,
                          presupuestoMax: e.target.value ? Number(e.target.value) : "",
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Zonas de Interés</label>
                <input
                  type="text"
                  placeholder="Ej. Palermo, Belgrano, Recoleta"
                  value={formData.busqueda?.zonas}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      busqueda: {
                        ...formData.busqueda!,
                        zonas: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                />
              </div>
            </div>
          )}

          {/* SECCIÓN 4: Origen y Notas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Origen del Lead</label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <select
                  value={formData.origen}
                  onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none bg-white"
                >
                  <option value="Zonaprop">Zonaprop</option>
                  <option value="Argenprop">Argenprop</option>
                  <option value="MercadoLibre">MercadoLibre</option>
                  <option value="Instagram">Instagram / Meta</option>
                  <option value="Referido">Referido</option>
                  <option value="Cartel">Cartel en Vía Pública</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Notas Iniciales</label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ej. Busca con urgencia, paga al contado."
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={cargando}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={cargando}
              className="px-5 py-2 text-xs font-bold cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Guardando...
                </span>
              ) : (
                <span>Guardar Contacto</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
