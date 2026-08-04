import Navbar from "@/components/Navbar";
import { SideBar } from "@/components/SideBar";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface Contrato {
  id: string;
  propiedadDireccion: string;
  propiedadTitulo: string;
  inquilinoNombre: string;
  inquilinoTelefono: string;
  inquilinoEmail: string;
  propietarioNombre: string;
  montoActual: number;
  fechaInicio: string;
  fechaFin: string;
  proximaActualizacion: string; // Fecha del próximo aumento
  indiceActualizacion: "ICL" | "IPC" | "Pre-fijado";
  estado: "activo" | "por_vencer" | "vencido";
  estadoPago: "pagado" | "pendiente" | "atrasado";
}

interface GestionContratosProps {
  initialContratos?: Contrato[];
}

const Contratos = ({ initialContratos = [] }: GestionContratosProps) => {
  const [contratos, setContratos] = useState<Contrato[]>(initialContratos);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<
    "todos" | "activo" | "por_vencer" | "vencido"
  >("todos");
  const [contratoSeleccionado, setContratoSeleccionado] =
    useState<Contrato | null>(null);

  // --- FUNCIÓN SIMULADA PARA REGISTRAR PAGO ---
  const handleRegistrarPago = async (id: string) => {
    try {
      // Aquí iría tu llamada a la API:
      // await api.put(`/contratos/${id}/pago`, { estadoPago: "pagado" });

      setContratos((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estadoPago: "pagado" } : c)),
      );

      if (contratoSeleccionado && contratoSeleccionado.id === id) {
        setContratoSeleccionado({
          ...contratoSeleccionado,
          estadoPago: "pagado",
        });
      }

      toast.success("Pago registrado con éxito");
    } catch (error) {
      toast.error("No se pudo registrar el pago");
    }
  };

  // --- HELPER PARA FORMATO MONEDA ---
  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(monto);
  };

  // --- CÁLCULO DE MÉTRICAS DINÁMICAS ---
  const activosCount = contratos.filter((c) => c.estado === "activo").length;
  const atrasadosCount = contratos.filter(
    (c) => c.estadoPago === "atrasado",
  ).length;

  // Contratos que actualizan este mes (simulado evaluando si la fecha está cerca)
  const proximasActualizacionesCount = contratos.filter((c) => {
    const hoy = new Date();
    const fechaAct = new Date(c.proximaActualizacion);
    return (
      fechaAct.getMonth() === hoy.getMonth() &&
      fechaAct.getFullYear() === hoy.getFullYear()
    );
  }).length;

  // --- FILTRADO DE CONTRATOS ---
  const contratosFiltrados = contratos
    .filter((c) => {
      if (filtroEstado === "todos") return true;
      return c.estado === filtroEstado;
    })
    .filter((c) => {
      const termino = busqueda.toLowerCase();
      return (
        c.inquilinoNombre.toLowerCase().includes(termino) ||
        c.propietarioNombre.toLowerCase().includes(termino) ||
        c.propiedadDireccion.toLowerCase().includes(termino)
      );
    });

  return (
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
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Contratos y Alquileres
                </h1>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                  Controlá la vigencia de los contratos de locación, estados de
                  cuenta mensuales y calendarios de indexación.
                </p>
              </div>

              {/* TARJETAS DE MÉTRICAS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm/50 flex flex-col justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Contratos Activos
                  </span>
                  <span className="text-3xl font-bold text-slate-900 mt-2">
                    {activosCount}
                  </span>
                </div>
                <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100 flex flex-col justify-between">
                  <span className="text-sm font-medium text-indigo-700">
                    Ajustes este Mes
                  </span>
                  <span className="text-3xl font-bold text-indigo-800 mt-2">
                    {proximasActualizacionesCount}
                  </span>
                </div>
                <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-100 flex flex-col justify-between">
                  <span className="text-sm font-medium text-rose-700">
                    Inquilinos con Atraso
                  </span>
                  <span className="text-3xl font-bold text-rose-800 mt-2">
                    {atrasadosCount}
                  </span>
                </div>
              </div>

              {/* BARRA DE BÚSQUEDA Y FILTROS */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-4">
                {/* Pestañas de Estado */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start">
                  {(["todos", "activo", "por_vencer", "vencido"] as const).map(
                    (estado) => (
                      <button
                        key={estado}
                        onClick={() => setFiltroEstado(estado)}
                        className={`text-xs px-3 py-2 font-bold rounded-lg transition-all capitalize cursor-pointer ${
                          filtroEstado === estado
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {estado.replace("_", " ")}
                      </button>
                    ),
                  )}
                </div>

                {/* Input de Búsqueda */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar por inquilino, propietario o dirección..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl py-2 px-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                    🔍
                  </span>
                </div>
              </div>

              {/* TABLA DE CONTRATOS */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                {contratosFiltrados.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    No se encontraron contratos con los criterios seleccionados.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-4 px-6">Inmueble / Ubicación</th>
                          <th className="py-4 px-6">Partes (Inq / Prop)</th>
                          <th className="py-4 px-6">Alquiler Actual</th>
                          <th className="py-4 px-6">Próximo Ajuste</th>
                          <th className="py-4 px-6">Pago</th>
                          <th className="py-4 px-6 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {contratosFiltrados.map((contrato) => (
                          <tr
                            key={contrato.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-900">
                                {contrato.propiedadDireccion}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">
                                {contrato.propiedadTitulo}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-xs space-y-0.5">
                              <div>
                                👤{" "}
                                <span className="font-semibold text-slate-800">
                                  Inq:
                                </span>{" "}
                                {contrato.inquilinoNombre}
                              </div>
                              <div>
                                🔑{" "}
                                <span className="font-medium text-slate-500">
                                  Prop:
                                </span>{" "}
                                {contrato.propietarioNombre}
                              </div>
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-900">
                              {formatearMoneda(contrato.montoActual)}
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-xs font-bold text-slate-700">
                                {new Date(
                                  contrato.proximaActualizacion,
                                ).toLocaleDateString("es-AR", {
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <span className="inline-block text-[10px] font-black tracking-wide text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded mt-0.5">
                                Por {contrato.indiceActualizacion}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                  contrato.estadoPago === "pagado"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : contrato.estadoPago === "pendiente"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-rose-50 text-rose-700 border-rose-200"
                                }`}
                              >
                                {contrato.estadoPago === "pagado"
                                  ? "Al día"
                                  : contrato.estadoPago === "pendiente"
                                    ? "Pendiente"
                                    : "Atrasado"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() =>
                                  setContratoSeleccionado(contrato)
                                }
                                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              >
                                Administrar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* MODAL: PANEL DE CONTROL DEL CONTRATO */}
              {contratoSeleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                  <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-slate-200 flex flex-col gap-5 animate-scale-up">
                    {/* Cabecera Modal */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                      <div>
                        <span
                          className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md border ${
                            contratoSeleccionado.estado === "activo"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}
                        >
                          Contrato {contratoSeleccionado.estado}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">
                          {contratoSeleccionado.propiedadDireccion}
                        </h3>
                      </div>
                      <button
                        onClick={() => setContratoSeleccionado(null)}
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

                    {/* Plazos de Vigencia */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">
                          Fecha de Inicio
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {new Date(
                            contratoSeleccionado.fechaInicio,
                          ).toLocaleDateString("es-AR")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">
                          Fin de Contrato
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {new Date(
                            contratoSeleccionado.fechaFin,
                          ).toLocaleDateString("es-AR")}
                        </span>
                      </div>
                    </div>

                    {/* Bloque Financiero e Indexación */}
                    <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-white shadow-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Valor de Locación Actual
                        </span>
                        <span className="text-xl font-black text-slate-900">
                          {formatearMoneda(contratoSeleccionado.montoActual)}
                        </span>
                      </div>
                      <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">
                            Próximo Ajuste
                          </span>
                          <span className="font-bold text-slate-800">
                            {new Date(
                              contratoSeleccionado.proximaActualizacion,
                            ).toLocaleDateString("es-AR")}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block font-medium">
                            Índice Pactado
                          </span>
                          <span className="font-bold text-indigo-600">
                            {contratoSeleccionado.indiceActualizacion}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Inquilino y Contacto */}
                    <div className="border border-slate-100 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase block">
                            Inquilino responsable
                          </span>
                          <p className="font-bold text-slate-900 text-sm">
                            {contratoSeleccionado.inquilinoNombre}
                          </p>
                          <p className="text-xs text-slate-400">
                            {contratoSeleccionado.inquilinoEmail}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${
                            contratoSeleccionado.estadoPago === "pagado"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-rose-50 border-rose-200 text-rose-700"
                          }`}
                        >
                          {contratoSeleccionado.estadoPago === "pagado"
                            ? "Al día"
                            : "Mora / Pendiente"}
                        </span>
                      </div>

                      {/* Botones de acción hacia el inquilino */}
                      <div className="flex gap-2 pt-1">
                        {contratoSeleccionado.estadoPago !== "pagado" && (
                          <button
                            onClick={() =>
                              handleRegistrarPago(contratoSeleccionado.id)
                            }
                            className="flex-1 text-center text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            💰 Registrar Cobro del Mes
                          </button>
                        )}
                        <a
                          href={`https://wa.me/${contratoSeleccionado.inquilinoTelefono.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hola ${contratoSeleccionado.inquilinoNombre}, te contactamos desde Inmobiliaria Argenta con respecto al alquiler de ${contratoSeleccionado.propiedadDireccion}...`,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-center text-xs bg-white text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                        >
                          WhatsApp 📲
                        </a>
                      </div>
                    </div>

                    {/* Notificaciones y recordatorios automatizados */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-center justify-between gap-4">
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 block">
                          ¿Toca indexar el precio?
                        </span>
                        <p className="text-slate-400">
                          Enviá un aviso de actualización con los nuevos índices
                          al inquilino.
                        </p>
                      </div>
                      <a
                        href={`https://wa.me/${contratoSeleccionado.inquilinoTelefono.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Estimado/a ${contratoSeleccionado.inquilinoNombre}, le notificamos que el próximo mes corresponde aplicar el ajuste de alquiler basado en el índice ${contratoSeleccionado.indiceActualizacion}. A la brevedad le enviaremos el cálculo formal del nuevo valor.`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-3 py-2 rounded-xl hover:bg-indigo-100 transition-colors text-nowrap"
                      >
                        Notificar Ajuste 📈
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contratos;
