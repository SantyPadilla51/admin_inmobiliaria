import Navbar from "@/components/Navbar";
import { SideBar } from "@/components/SideBar";
import { formatCurrencyAR } from "@/helpers/formatCurrency";
import { createVisita } from "@/services/visitas/createVisita";
import { getPropiedades } from "@/services/props/getProps";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "../styles/datepicker.css";
import type { Visita } from "@/interfaces/Visita";
import { getVisitas } from "@/services/visitas/getVisitas";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { updateVisita } from "@/services/visitas/updateVisita";
import toast, { Toaster } from "react-hot-toast";
import { ConfirmDeleteModal } from "@/helpers/deleteModal";
import api from "@/config/axios";
import { Button } from "@base-ui/react/button";

interface AgendaVisitasProps {
  initialVisitas?: Visita[];
}

registerLocale("es", es);

const Agenda = ({ initialVisitas = [] }: AgendaVisitasProps) => {
  const queryClient = useQueryClient();
  const [cargando, setCargando] = useState(false);
  const [nuevaVisita, setNuevaVisita] = useState({
    nombre: "",
    telefono: "",
    email: "",
    fecha: new Date().toISOString().split("T")[0],
    hora: "10:00",
    propiedadId: "",
    estado: "a_confirmar",
    notas: "",
  });
  const [itemAEliminar, setItemAEliminar] = useState<string | null>(null);
  const [modalNuevoVisitaOpen, setModalNuevoVisitaOpen] = useState(false);
  const [filtroTiempo, setFiltroTiempo] = useState<"todos" | "hoy" | "semana">(
    "todos",
  );
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [visitaSeleccionada, setVisitaSeleccionada] = useState<Visita | null>(
    null,
  );
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const { data: visitas = [], isLoading: cargandoVisitas } = useQuery<Visita[]>(
    {
      queryKey: ["admin_visitas"],
      queryFn: () => getVisitas(),
      initialData: initialVisitas,
    },
  );

  const { data: propiedades = [] } = useQuery({
    queryKey: ["admin_propiedades"],

    queryFn: () => getPropiedades(),
  });

  const parseFecha = (fechaStr: string) => {
    if (!fechaStr) return null;
    const [year, month, day] = fechaStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleActualizarEstado = async (
    nuevoEstado: "pendiente" | "confirmada" | "realizada" | "cancelada",
  ) => {
    setVisitaSeleccionada((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        estado: nuevoEstado,
      };
    });
  };

  const esHoy = (fechaISO: string) => {
    const hoy = new Date();
    const fecha = new Date(fechaISO);
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  };

  const esEstaSemana = (fechaISO: string) => {
    const hoy = new Date();
    const fecha = new Date(fechaISO);
    const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
    const finSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 6));
    return fecha >= inicioSemana && fecha <= finSemana;
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
      const { data } = await api.delete(`/visitas/${itemAEliminar}`);

      await queryClient.invalidateQueries({ queryKey: ["admin_visitas"] });

      if (data.ok === true) {
        setDeleteModal(false);
        setItemAEliminar(null);
        setVisitaSeleccionada(null);
        toast.success(data.msg, {
          duration: 4000,
          icon: "✅",
          position: "bottom-right",
          style: {
            border: "2px solid #22c55e",
            color: "#14532d",
            backgroundColor: "#f0fdf4",
            borderRadius: "20px",
          },
        });
      }
    } catch {
      toast.error("Error al eliminar la visita", {
        duration: 4000,
        icon: "❌",
        position: "bottom-right",
        style: {
          border: "2px solid #ef4444",
          color: "#7f1d1d",
          backgroundColor: "#fef2f2",
          borderRadius: "20px",
        },
      });
    } finally {
      setCargando(false);
    }
  };

  const visitasHoyCount = visitas.filter(
    (v) => esHoy(v.fecha) && v.estado !== "cancelada",
  ).length;
  const pendientesCount = visitas.filter(
    (v) => v.estado === "pendiente",
  ).length;
  const canceladasCount = visitas.filter(
    (v) => v.estado === "cancelada",
  ).length;

  const visitasFiltradas = visitas
    .filter((v) => {
      if (filtroTiempo === "hoy") return esHoy(v.fecha);
      if (filtroTiempo === "semana") return esEstaSemana(v.fecha);
      return true;
    })
    .filter((v) => {
      if (filtroEstado === "todos") return true;
      return v.estado === filtroEstado;
    })
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  if (cargandoVisitas) {
    return (
      <div className="flex mt-10 items-center justify-center font-sans">
        <div className="flex flex-col items-center text-center gap-3">
          <ScaleLoader />
          <p className="text-black font-medium">Cargando visitas...</p>
        </div>
      </div>
    );
  }

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

              <div className="flex-1 flex flex-col  p-1 max-w-7xl mx-auto">
                {/* ENCABEZADO */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Agenda de Visitas
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Coordiná los turnos de exhibición de propiedades y
                      asignación de asesores comerciales.
                    </p>
                  </div>
                  <button
                    onClick={() => setModalNuevoVisitaOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <Plus size={16} />
                    <span> Registrar Consulta Manual</span>
                  </button>
                </div>

                {/* TARJETAS DE MÉTRICAS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 flex flex-col justify-between">
                    <span className="text-sm font-medium text-blue-700">
                      Visitas para Hoy
                    </span>
                    <span className="text-3xl font-bold text-blue-800 mt-2">
                      {visitasHoyCount}
                    </span>
                  </div>
                  <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-100 flex flex-col justify-between">
                    <span className="text-sm font-medium text-amber-700">
                      Por Confirmar
                    </span>
                    <span className="text-3xl font-bold text-amber-800 mt-2">
                      {pendientesCount}
                    </span>
                  </div>
                  <div className="bg-red-50/60 p-5 rounded-2xl border border-red-100 flex flex-col justify-between">
                    <span className="text-sm font-medium text-red-700">
                      Canceladas
                    </span>
                    <span className="text-3xl font-bold text-red-800 mt-2">
                      {canceladasCount}
                    </span>
                  </div>
                </div>

                {/* FILTROS Y CONTROLES */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-slate-200 pb-2 mb-4">
                  {/* Filtro de Tiempo */}
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                    {(["todos", "hoy", "semana"] as const).map((tiempo) => (
                      <button
                        key={tiempo}
                        onClick={() => setFiltroTiempo(tiempo)}
                        className={`text-xs px-3 py-2 font-bold rounded-lg transition-all capitalize cursor-pointer ${
                          filtroTiempo === tiempo
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {tiempo === "todos"
                          ? "Todas"
                          : tiempo === "semana"
                            ? "Esta Semana"
                            : "Hoy"}
                      </button>
                    ))}
                  </div>

                  {/* Selector de Estado */}
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer w-full sm:w-auto"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">
                      Pendientes de confirmacion
                    </option>
                    <option value="confirmada">Confirmadas</option>
                    <option value="realizada">Realizadas</option>
                    <option value="cancelada">Canceladas</option>
                  </select>
                </div>

                {/* CRONOGRAMA / TIMELINE */}
                <div className="space-y-4">
                  {visitasFiltradas.length === 0 ? (
                    <div className="bg-white p-12 text-center text-slate-500 rounded-2xl border border-slate-200/60 shadow-sm">
                      No hay visitas programadas con los filtros seleccionados.
                    </div>
                  ) : (
                    visitasFiltradas.map((visita) => {
                      const fechaObj = new Date(visita.fecha);
                      const hora = fechaObj.toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      const fechaTexto = fechaObj.toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      });

                      return (
                        <div
                          key={visita.id}
                          className="bg-white rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          {/* Bloque Horario */}
                          <div className="flex md:flex-col items-baseline md:items-start gap-2 md:gap-0 min-w-30px">
                            <span className="text-xl font-black text-blue-600 tracking-tight">
                              {hora}
                            </span>
                            <span className="text-xs font-semibold text-slate-400 capitalize">
                              {fechaTexto}
                            </span>
                          </div>

                          {/* Información Central */}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-slate-900 text-base">
                                {visita.nombre}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                  visita.estado === "pendiente"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : visita.estado === "confirmada"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : visita.estado === "realizada"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                }`}
                              >
                                {visita.estado
                                  .replace(
                                    "pendiente",
                                    "pendiente de confirmacion",
                                  )
                                  .replace("_", " ")}
                              </span>
                            </div>
                          </div>

                          {/* Botón Acción */}
                          <div className="w-full md:w-auto text-right shrink-0">
                            <button
                              onClick={() => setVisitaSeleccionada(visita)}
                              className="w-full md:w-auto text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                            >
                              Detalles del Turno
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {modalNuevoVisitaOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <form
                      onSubmit={(e) =>
                        createVisita(
                          e,
                          queryClient,
                          nuevaVisita,
                          setCargando,
                          setNuevaVisita,
                          setModalNuevoVisitaOpen,
                        )
                      }
                      className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl border border-slate-200 flex flex-col gap-4 animate-scale-up max-h-[90vh] overflow-y-auto"
                    >
                      {/* Header Modal */}
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-blue-600 h-5 w-5" />
                          <h3 className="text-lg font-bold text-slate-900">
                            Agendar Nueva Visita
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setModalNuevoVisitaOpen(false)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Nombre del Cliente */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-slate-500">
                            Nombre del Interesado / Cliente *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: María González"
                            value={nuevaVisita.nombre}
                            onChange={(e) =>
                              setNuevaVisita({
                                ...nuevaVisita,
                                nombre: e.target.value,
                              })
                            }
                            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Teléfono y Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500">
                              Teléfono de Contacto *
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="Ej: +54 9 11 1234-5678"
                              value={nuevaVisita.telefono}
                              onChange={(e) =>
                                setNuevaVisita({
                                  ...nuevaVisita,
                                  telefono: e.target.value,
                                })
                              }
                              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500">
                              Email (Opcional)
                            </label>
                            <input
                              type="email"
                              placeholder="Ej: maria@mail.com"
                              value={nuevaVisita.email}
                              onChange={(e) =>
                                setNuevaVisita({
                                  ...nuevaVisita,
                                  email: e.target.value,
                                })
                              }
                              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Fecha y Hora de la Visita (NUEVO) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                              <Calendar size={14} /> Fecha de la Visita *
                            </label>

                            {/* Contenedor relativo para el input y su ícono */}
                            <div className="relative flex items-center">
                              <DatePicker
                                selected={parseFecha(nuevaVisita.fecha)}
                                onChange={(date: Date | null) => {
                                  if (date) {
                                    const year = date.getFullYear();
                                    const month = String(
                                      date.getMonth() + 1,
                                    ).padStart(2, "0");
                                    const day = String(date.getDate()).padStart(
                                      2,
                                      "0",
                                    );
                                    const fechaFormatted = `${year}-${month}-${day}`;

                                    setNuevaVisita({
                                      ...nuevaVisita,
                                      fecha: fechaFormatted,
                                    });
                                  }
                                }}
                                minDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                locale="es"
                                placeholderText="Selecciona una fecha"
                                required
                                // Le agregamos pr-10 para que el texto no se solape con el ícono
                                className="w-full text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                              />

                              {/* Ícono absoluto a la derecha del input */}
                              <Calendar
                                size={18}
                                className="absolute right-3 text-slate-400 pointer-events-none"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                              <Clock size={14} /> Hora *
                            </label>
                            <select
                              required
                              value={nuevaVisita.hora}
                              onChange={(e) =>
                                setNuevaVisita({
                                  ...nuevaVisita,
                                  hora: e.target.value,
                                })
                              }
                              className="w-full text-sm bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                              <option value="" disabled>
                                Selecciona una hora
                              </option>
                              {Array.from({
                                length: ((18 - 7) * 60) / 15 + 1,
                              }).map((_, index) => {
                                const totalMinutes = 7 * 60 + index * 15; // Salto de 15 en 15 minutos
                                const hours = Math.floor(totalMinutes / 60)
                                  .toString()
                                  .padStart(2, "0");
                                const minutes = (totalMinutes % 60)
                                  .toString()
                                  .padStart(2, "0");
                                const timeString = `${hours}:${minutes}`;

                                return (
                                  <option key={timeString} value={timeString}>
                                    {timeString} hs
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>

                        {/* Selector de Propiedad de Interés */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-500">
                            Propiedad a Visitar *
                          </label>

                          <select
                            required
                            value={nuevaVisita.propiedadId}
                            onChange={(e) =>
                              setNuevaVisita({
                                ...nuevaVisita,
                                propiedadId: e.target.value,
                              })
                            }
                            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value="">
                              -- Seleccionar Propiedad --
                            </option>
                            {propiedades.map((prop) => (
                              <option key={prop.id} value={prop.id}>
                                {`${prop.operacion?.toUpperCase()} - ${prop.titulo}`}
                              </option>
                            ))}
                          </select>

                          {/* Preview Card de la Propiedad */}
                          {nuevaVisita.propiedadId &&
                            (() => {
                              const propSeleccionada = propiedades.find(
                                (p) =>
                                  p.id?.toString() === nuevaVisita.propiedadId,
                              );

                              if (!propSeleccionada) return null;

                              const primeraFoto =
                                propSeleccionada.imagenes?.[0];

                              return (
                                <div className="mt-1 h-36 flex items-center gap-4 p-3 bg-slate-50/80 rounded-xl border border-slate-200 animate-fadeIn transition-all">
                                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
                                    <img
                                      src={primeraFoto}
                                      alt={propSeleccionada.titulo}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-sm font-bold text-slate-900">
                                        {formatCurrencyAR(
                                          propSeleccionada.precio,
                                        )}
                                      </span>
                                      <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wide uppercase ${
                                          propSeleccionada.operacion ===
                                          "alquiler"
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
                                      {propSeleccionada.direccion
                                        ? `, ${propSeleccionada.direccion}`
                                        : ""}{" "}
                                      •{" "}
                                      <span className="font-medium text-slate-600 capitalize">
                                        {propSeleccionada.barrio}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                        </div>

                        {/* Notas / Observaciones */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-slate-500">
                            Notas u Observaciones
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Ej: Trae a la pareja. Pedir llave al encargado antes de las 15 hs..."
                            value={nuevaVisita.notas}
                            onChange={(e) =>
                              setNuevaVisita({
                                ...nuevaVisita,
                                notas: e.target.value,
                              })
                            }
                            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setModalNuevoVisitaOpen(false);
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
                              Agendando...
                            </span>
                          ) : (
                            <span>Agendar Visita</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* MODAL DE DETALLE Y GESTIÓN */}
                {visitaSeleccionada && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl border border-slate-200 flex flex-col gap-5 animate-scale-up">
                      {/* Cabecera */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            Gestión de Turno
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Ref Propiedad: #{visitaSeleccionada.propiedad_id}
                          </p>
                        </div>
                        <button
                          onClick={() => setVisitaSeleccionada(null)}
                          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Fecha, Hora e Infraestructura */}
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">
                            Fecha y Hora
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {new Date(
                              visitaSeleccionada.fecha,
                            ).toLocaleDateString("es-AR")}{" "}
                            -{" "}
                            {new Date(
                              visitaSeleccionada.fecha,
                            ).toLocaleTimeString("es-AR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                          </span>
                        </div>
                      </div>

                      {/* Propiedad vinculada */}
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Propiedad consultada
                        </span>

                        {(() => {
                          if (!visitaSeleccionada.propiedad_id) return null;

                          const propSeleccionada = propiedades.find(
                            (p) =>
                              p.id?.toString() ===
                              visitaSeleccionada.propiedad_id,
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
                                  {propSeleccionada.direccion
                                    ? `, ${propSeleccionada.direccion}`
                                    : ""}{" "}
                                  •{" "}
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

                      {/* Contacto del Cliente */}
                      <div className="border border-slate-100 p-4 rounded-xl space-y-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          Datos del Interesado
                        </span>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                          <div>
                            <p className="font-bold text-slate-900">
                              {visitaSeleccionada.nombre}
                            </p>
                            <p className="text-xs text-slate-400">
                              {visitaSeleccionada.email}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={`https://wa.me/${visitaSeleccionada.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${visitaSeleccionada.nombre}, te contacto desde Inmobiliaria Argenta para confirmar nuestra visita coordinada...`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-2 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                            >
                              WhatsApp 📲
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Notas / Comentarios */}
                      {visitaSeleccionada.notas && (
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Notas de la Coordinación
                          </span>
                          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/50 italic">
                            "{visitaSeleccionada.notas}"
                          </p>
                        </div>
                      )}

                      {/* Acciones de Estado */}
                      <div className="border-t border-slate-100 pt-4 space-y-2">
                        <span className="text-xs font-bold text-slate-400 block">
                          Cambiar estado del turno:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            onClick={() => handleActualizarEstado("pendiente")}
                            className={`text-xs py-2 font-bold rounded-xl border transition-colors cursor-pointer ${
                              visitaSeleccionada.estado === "pendiente"
                                ? "bg-amber-600 border-amber-600 text-white"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            Pendiente de Confirmacion
                          </button>
                          <button
                            onClick={() => handleActualizarEstado("confirmada")}
                            className={`text-xs py-2 font-bold rounded-xl border transition-colors cursor-pointer ${
                              visitaSeleccionada.estado === "confirmada"
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => handleActualizarEstado("realizada")}
                            className={`text-xs py-2 font-bold rounded-xl border transition-colors cursor-pointer ${
                              visitaSeleccionada.estado === "realizada"
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            Realizada
                          </button>
                          <button
                            onClick={() => handleActualizarEstado("cancelada")}
                            className={`text-xs py-2 font-bold rounded-xl border transition-colors cursor-pointer ${
                              visitaSeleccionada.estado === "cancelada"
                                ? "bg-red-600 border-red-600 text-white"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          onClick={() =>
                            handleOpenDelete(visitaSeleccionada.id)
                          }
                          className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm cursor-pointer active:scale-95 transition-all"
                        >
                          <div className="flex gap-3">
                            <Trash2 size={15} /> Eliminar Consulta
                          </div>
                        </Button>
                        <Button
                          onClick={() =>
                            updateVisita(
                              visitaSeleccionada.id,
                              visitaSeleccionada,
                              setCargando,
                              setVisitaSeleccionada,
                              queryClient,
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
                  onConfirm={(e) => handleDelete(e)}
                  cargando={cargando}
                  mensaje="¿Estás seguro de que deseas eliminar esta visita? Se eliminará permanentemente de la base de datos."
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Agenda;
