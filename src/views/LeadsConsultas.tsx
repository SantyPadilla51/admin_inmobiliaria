import Navbar from "@/components/Navbar";
import { SideBar } from "@/components/SideBar";
import api from "@/config/axios";
import { ConfirmDeleteModal } from "@/helpers/deleteModal";
import { formatCurrencyAR } from "@/helpers/formatCurrency";
import type { Lead } from "@/interfaces/Lead";
import { createLead } from "@/services/leads/createLead";
import { getLeads } from "@/services/leads/getLeads";
import { getPropiedades } from "@/services/props/getProps";
import { updateLead } from "@/services/leads/updateLead";
import { Button } from "@base-ui/react/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquare, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { Toaster } from "react-hot-toast";

interface ConsultasLeadsProps {
  initialLeads?: Lead[];
}

const ConsultasLeads = ({ initialLeads = [] }: ConsultasLeadsProps) => {
  const queryClient = useQueryClient();
  const [cargando, setCargando] = useState(false);
  const [tipoContacto, setTipoContacto] = useState<"presencial" | "whatsapp" | "web">("whatsapp");
  const [filtro, setFiltro] = useState<"todos" | "pendiente" | "en_proceso" | "finalizado">("todos");
  const [leadSeleccionado, setLeadSeleccionado] = useState<Lead | null>(null);
  const [itemAEliminar, setItemAEliminar] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [modalNuevoOpen, setModalNuevoOpen] = useState(false);
  const [nuevoLead, setNuevoLead] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
    fuente: "",
    propiedadId: "",
  });

  const { data: consultas = [], isLoading: cargandoConsultas } = useQuery<Lead[]>({
    queryKey: ["admin_leads"],
    queryFn: () => getLeads(),
    initialData: initialLeads,
  });

  const { data: propiedades = [] } = useQuery({
    queryKey: ["admin_propiedades"],

    queryFn: () => getPropiedades(),
  });

  const handleCambiarEstado = async (nuevoEstado: "pendiente" | "en_proceso" | "finalizado") => {
    setLeadSeleccionado((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        estado: nuevoEstado,
      };
    });
  };

  const handleOpenDelete = (id: string) => {
    setItemAEliminar(id);
    setDeleteModal(true);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemAEliminar) return;

    setCargando(true);
    try {
      const { data } = await api.delete(`/consultas/${itemAEliminar}`);

      queryClient.invalidateQueries({ queryKey: ["admin_leads"] });

      if (data.ok === true) {
        setDeleteModal(false);
        setItemAEliminar(null);
        setLeadSeleccionado(null);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setCargando(false);
    }
  };

  const totalPendientes = consultas.filter((lead) => lead.estado === "pendiente").length;

  const enProceso = consultas.filter((lead) => lead.estado === "en_proceso").length;

  const leadsFiltrados = consultas.filter((lead) => {
    const coincideEstado = filtro === "todos" || lead.estado === filtro;

    return coincideEstado;
  });

  return (
    <>
      <Toaster />
      <div className="flex h-screen bg-slate-50/50 font-sans text-slate-800 antialiased">
        <main className="flex-1 flex flex-col overflow-hidden">
          <Navbar />

          <section className=" p-8 bg-linear-to-b from-white to-slate-50/30">
            <div className="flex w-full mx-auto gap-8 p-4">
              <aside className="w-72  sticky">
                <SideBar />
              </aside>

              <div className=" flex-1 flex flex-col  p-1 max-w-7xl mx-auto">
                {/* ENCABEZADO */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Consultas y Leads</h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Gestioná los interesados de tus propiedades publicadas y hacé el seguimiento de contactos.
                    </p>
                  </div>

                  {/* BOTÓN REGISTRAR CONSULTA MANUAL */}
                  <button
                    onClick={() => setModalNuevoOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <Plus size={16} />
                    <span>Registrar Consulta Manual</span>
                  </button>
                </div>

                {/* TARJETAS DE MÉTRICAS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm/50 flex flex-col justify-between">
                    <span className="text-sm font-medium text-slate-500">Total Recibidas</span>
                    <span className="text-3xl font-bold text-slate-900 mt-2">{consultas.length}</span>
                  </div>
                  <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-100 flex flex-col justify-between">
                    <span className="text-sm font-medium text-amber-700">Sin Responder</span>
                    <span className="text-3xl font-bold text-amber-800 mt-2">{totalPendientes}</span>
                  </div>
                  <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 flex flex-col justify-between">
                    <span className="text-sm font-medium text-blue-700">En Seguimiento</span>
                    <span className="text-3xl font-bold text-blue-800 mt-2">{enProceso}</span>
                  </div>
                </div>

                {/* PESTAÑAS DE FILTRADO (TABS) */}
                <div className="flex border-b border-slate-200 gap-2">
                  {(["todos", "pendiente", "en_proceso", "finalizado"] as const).map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => setFiltro(tipo)}
                      className={`capitalize py-3 px-4 font-semibold text-sm border-b-2 transition-all -mb-px cursor-pointer ${
                        filtro === tipo
                          ? "border-blue-600 text-blue-600 font-bold"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tipo.replace("_", " ")}
                    </button>
                  ))}
                </div>

                {/* TABLA PRINCIPAL DE LEADS */}
                <div className="mt-12 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  {cargandoConsultas ? (
                    <div className="flex mt-10 items-center justify-center font-sans">
                      <div className="flex flex-col items-center text-center gap-3">
                        <ScaleLoader />
                        <p className="text-black font-medium">Cargando consultas...</p>
                      </div>
                    </div>
                  ) : leadsFiltrados.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">No se encontraron consultas en esta sección.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-6">Cliente</th>
                            <th className="py-4 px-6">Fuente</th>
                            <th className="py-4 px-6">Fecha</th>
                            <th className="py-4 px-6 text-right">Estado</th>
                            <th className="py-4 px-6 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                          {leadsFiltrados.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-6">
                                <div className="font-semibold text-slate-900">{lead.nombre}</div>
                                <div className="text-xs text-slate-400 mt-0.5">{lead.email}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-medium text-slate-800 max-w-xs truncate">{lead.fuente}</div>
                              </td>
                              <td className="py-4 px-6 text-slate-500">
                                {new Date(lead.created_at).toLocaleDateString("es-AR")}
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                    lead.estado === "pendiente"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : lead.estado === "en_proceso"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  }`}
                                >
                                  {lead.estado === "pendiente"
                                    ? "Pendiente"
                                    : lead.estado === "en_proceso"
                                      ? "En Proceso"
                                      : "Finalizado"}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => setLeadSeleccionado(lead)}
                                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                >
                                  Gestionar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* ─── NUEVO MODAL: REGISTRAR CONSULTA MANUAL ─── */}
                  {modalNuevoOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                      <form
                        onSubmit={(e) =>
                          createLead(
                            e,
                            queryClient,
                            nuevoLead,
                            propiedades,
                            setCargando,
                            setNuevoLead,
                            setModalNuevoOpen,
                          )
                        }
                        className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl border border-slate-200 flex flex-col gap-4 animate-scale-up"
                      >
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h3 className="text-lg font-bold text-slate-900">Registrar Consulta Manual</h3>
                          <button
                            type="button"
                            onClick={() => setModalNuevoOpen(false)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-3">
                          {/* Nombre */}
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500">Nombre del Interesado *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ej: Juan Pérez"
                              value={nuevoLead.nombre}
                              onChange={(e) =>
                                setNuevoLead({
                                  ...nuevoLead,
                                  nombre: e.target.value,
                                })
                              }
                              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* Teléfono y Email */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-slate-500">Teléfono *</label>
                              <input
                                type="tel"
                                required
                                placeholder="Ej: +54 9 11 1234-5678"
                                value={nuevoLead.telefono}
                                onChange={(e) =>
                                  setNuevoLead({
                                    ...nuevoLead,
                                    telefono: e.target.value,
                                  })
                                }
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-slate-500">Email (Opcional)</label>
                              <input
                                type="email"
                                placeholder="Ej: juan@mail.com"
                                value={nuevoLead.email}
                                onChange={(e) =>
                                  setNuevoLead({
                                    ...nuevoLead,
                                    email: e.target.value,
                                  })
                                }
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          {/* Selector de Propiedad de Interés */}
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500">Propiedad de Interés *</label>

                            <select
                              required
                              value={nuevoLead.propiedadId}
                              onChange={(e) =>
                                setNuevoLead({
                                  ...nuevoLead,
                                  propiedadId: e.target.value,
                                })
                              }
                              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                              <option value="">-- Seleccionar Propiedad --</option>
                              {propiedades.map((prop) => (
                                <option key={prop.id} value={prop.id}>
                                  {`${prop.operacion?.toUpperCase()} - ${prop.titulo}`}
                                </option>
                              ))}
                            </select>

                            {nuevoLead.propiedadId &&
                              (() => {
                                const propSeleccionada = propiedades.find(
                                  (p) => p.id?.toString() === nuevoLead.propiedadId,
                                );

                                if (!propSeleccionada) return null;

                                const primeraFoto = propSeleccionada.imagenes[0];

                                return (
                                  <div className="mt-1 h-40 flex items-center gap-4 p-3 bg-slate-50/80 rounded-xl border border-slate-200 animate-fadeIn transition-all">
                                    {/* Contenedor de la imagen */}
                                    <div className="relative h-35 w-35 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
                                      <img
                                        src={primeraFoto}
                                        alt={propSeleccionada.titulo}
                                        className="h-full w-full object-contain"
                                      />
                                    </div>

                                    {/* Información detallada de la propiedad */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold text-slate-900">
                                          {formatCurrencyAR(propSeleccionada.precio)}
                                        </span>
                                        <span
                                          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wide uppercase ${
                                            propSeleccionada.operacion === "alquiler"
                                              ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                                              : "bg-blue-50 text-blue-700 border border-blue-200/60"
                                          }`}
                                        >
                                          {propSeleccionada.operacion || "Venta"}
                                        </span>
                                      </div>

                                      <p className="text-xs font-medium text-slate-700 truncate mt-0.5">
                                        {propSeleccionada.titulo}
                                      </p>

                                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                        {propSeleccionada.calle}{" "}
                                        {propSeleccionada.direccion ? `, ${propSeleccionada.direccion}` : ""} •{" "}
                                        <span className="font-medium text-slate-600 capitalize">
                                          {propSeleccionada.barrio}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                );
                              })()}
                          </div>

                          {/* Comentarios o Mensaje */}
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500">
                              Notas / Requerimientos de la Consulta
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Ej: Llamó preguntando por financiación. Quiere ir a verla este sábado por la mañana..."
                              value={nuevoLead.mensaje}
                              onChange={(e) =>
                                setNuevoLead({
                                  ...nuevoLead,
                                  mensaje: e.target.value,
                                })
                              }
                              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                          </div>

                          {/* OPCIONES_FUENTE */}
                          <div className="mt-8 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden p-6">
                            {/* Título de la sección */}
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">Fuente de la consulta</h3>

                            {/* Contenedor de las opciones */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Opción Presencial */}
                              <label
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                  tipoContacto === "presencial"
                                    ? "border-blue-600 bg-blue-50/40 text-blue-900 shadow-sm"
                                    : "border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-600"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="tipoContacto"
                                  value="presencial"
                                  checked={tipoContacto === "presencial"}
                                  onClick={() => setTipoContacto("presencial")}
                                  onChange={(e) =>
                                    setNuevoLead({
                                      ...nuevoLead,
                                      fuente: e.target.value,
                                    })
                                  }
                                  className="sr-only"
                                />
                                {/* Ícono o indicador visual */}
                                <div
                                  className={`p-2 rounded-lg ${tipoContacto === "presencial" ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200"}`}
                                >
                                  <Users size={20} />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">Reunión Presencial</p>
                                  <p className="text-xs text-slate-500 mt-0.5">En nuestras oficinas</p>
                                </div>
                              </label>

                              {/* Opción WhatsApp */}
                              <label
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                  tipoContacto === "whatsapp"
                                    ? "border-emerald-600 bg-emerald-50/40 text-emerald-900 shadow-sm"
                                    : "border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-600"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="tipoContacto"
                                  value="whatsapp"
                                  checked={tipoContacto === "whatsapp"}
                                  onClick={() => setTipoContacto("whatsapp")}
                                  onChange={(e) =>
                                    setNuevoLead({
                                      ...nuevoLead,
                                      fuente: e.target.value,
                                    })
                                  }
                                  className="sr-only"
                                />
                                {/* Ícono o indicador visual */}
                                <div
                                  className={`p-2 rounded-lg ${tipoContacto === "whatsapp" ? "bg-emerald-600 text-white" : "bg-white text-slate-400 border border-slate-200"}`}
                                >
                                  <MessageSquare size={20} />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">WhatsApp</p>
                                  <p className="text-xs text-slate-500 mt-0.5">Respuesta inmediata por chat</p>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                          <button
                            type="button"
                            onClick={() => {
                              setModalNuevoOpen(false);
                              setCargando(false);
                            }}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 rounded-xl border border-slate-200 cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={cargando}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm cursor-pointer active:scale-95 transition-all"
                          >
                            {cargando ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-4 w-4" />
                                Guardando...
                              </span>
                            ) : (
                              <span>Cargar Consulta</span>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* MODAL DE DETALLE Y ACCIONES */}
                  {leadSeleccionado && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
                      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-slate-200 flex flex-col gap-5">
                        {/* Cabecera Modal */}
                        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">Detalle de Consulta</h3>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">ID Lead: #{leadSeleccionado.id}</p>
                          </div>
                          <button
                            onClick={() => setLeadSeleccionado(null)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Datos del Cliente */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 block font-medium">Nombre Completo</span>
                            <span className="text-sm font-bold text-slate-900">{leadSeleccionado.nombre}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Fecha de Envío</span>
                            <span className="text-sm font-semibold text-slate-800">
                              {new Date(leadSeleccionado.created_at).toLocaleDateString("es-AR")}
                            </span>
                          </div>
                          <div className="col-span-2 border-t border-slate-200/60 pt-2 mt-1 grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-slate-400 block font-medium">Email</span>
                              <a
                                href={`mailto:${leadSeleccionado.email}`}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {leadSeleccionado.email}
                              </a>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-medium">Teléfono</span>
                              <a
                                href={`https://wa.me/${leadSeleccionado.telefono.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 hover:underline font-bold flex items-center gap-1"
                              >
                                {leadSeleccionado.telefono} 📲
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Propiedad vinculada */}
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Propiedad consultada
                          </span>

                          {(() => {
                            if (!leadSeleccionado.propiedad_id) return null;

                            const propSeleccionada = propiedades.find(
                              (p) => p.id?.toString() === leadSeleccionado.propiedad_id,
                            );

                            if (!propSeleccionada) return null;

                            const primeraFoto = propSeleccionada.imagenes?.[0];

                            return (
                              <div className="relative mt-1 h-40 flex items-center gap-4 p-3 bg-slate-50/80 rounded-xl border border-slate-200 animate-fadeIn transition-all">
                                {/* Contenedor de la imagen */}
                                <div className="relative h-35 w-35 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
                                  <img
                                    src={primeraFoto}
                                    alt={propSeleccionada.titulo}
                                    className="h-full w-full object-contain"
                                  />
                                </div>

                                {/* Información detallada de la propiedad */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-bold text-slate-900">
                                      {formatCurrencyAR(propSeleccionada.precio)}
                                    </span>
                                    <span
                                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wide uppercase ${
                                        propSeleccionada.operacion === "alquiler"
                                          ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                                          : "bg-blue-50 text-blue-700 border border-blue-200/60"
                                      }`}
                                    >
                                      {propSeleccionada.operacion || "Venta"}
                                    </span>
                                  </div>

                                  <p className="text-xs font-medium text-slate-700 truncate mt-0.5">
                                    {propSeleccionada.titulo}
                                  </p>

                                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                    {propSeleccionada.calle}{" "}
                                    {propSeleccionada.direccion ? `, ${propSeleccionada.direccion}` : ""} •{" "}
                                    <span className="font-medium text-slate-600 capitalize">
                                      {propSeleccionada.barrio}
                                    </span>
                                  </p>

                                  <Link
                                    className="absolute right-4 bottom-2 hover:underline hover:text-blue-600"
                                    to={`http://localhost:5174/propiedad/${propSeleccionada.id}`}
                                    target="_blank"
                                  >
                                    Ver propiedad
                                  </Link>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Mensaje de la Consulta */}
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Mensaje del interesado
                          </span>
                          <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/60 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-line">
                            "{leadSeleccionado.mensaje}"
                          </p>
                        </div>

                        {/* Selector de Cambios de Estado de Gestión */}
                        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-xs font-bold text-slate-400 block">Cambiar estado de gestión:</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCambiarEstado("pendiente")}
                              className={`text-xs px-3 py-1.5 font-semibold rounded-lg border transition-colors cursor-pointer ${
                                leadSeleccionado.estado === "pendiente"
                                  ? "bg-amber-600 border-amber-600 text-white font-bold"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              Pendiente
                            </button>
                            <button
                              onClick={() => handleCambiarEstado("en_proceso")}
                              className={`text-xs px-3 py-1.5 font-semibold rounded-lg border transition-colors cursor-pointer ${
                                leadSeleccionado.estado === "en_proceso"
                                  ? "bg-blue-600 border-blue-600 text-white font-bold"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              En Proceso
                            </button>
                            <button
                              onClick={() => handleCambiarEstado("finalizado")}
                              className={`text-xs px-3 py-1.5 font-semibold rounded-lg border transition-colors cursor-pointer ${
                                leadSeleccionado.estado === "finalizado"
                                  ? "bg-emerald-600 border-emerald-600 text-white font-bold"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              Finalizado
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <Button
                            onClick={() => handleOpenDelete(leadSeleccionado.id)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm cursor-pointer active:scale-95 transition-all"
                          >
                            <div className="flex gap-3">
                              <Trash2 size={15} /> Eliminar Consulta
                            </div>
                          </Button>
                          <Button
                            onClick={() =>
                              updateLead(
                                leadSeleccionado.id,
                                leadSeleccionado.estado,
                                queryClient,
                                setCargando,
                                setLeadSeleccionado,
                              )
                            }
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm cursor-pointer active:scale-95 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:scale-100"
                            disabled={cargando}
                          >
                            {cargando ? (
                              <span className="flex items-center justify-center gap-2 text-center">
                                <Loader2 className="animate-spin h-4 w-4 " />
                                Guardando...
                              </span>
                            ) : (
                              <span>Guardar</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <ConfirmDeleteModal
                    deleteModal={deleteModal}
                    setDeleteModal={setDeleteModal}
                    onConfirm={handleDelete}
                    cargando={cargando}
                    mensaje="¿Estás seguro de que deseas eliminar esta consulta? Se eliminará permanentemente de la base de datos."
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ConsultasLeads;
