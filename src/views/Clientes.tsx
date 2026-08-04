import { EditarClienteModal } from "@/components/EditContactoModal";
import Navbar from "@/components/Navbar";
import { NuevoContactoModal } from "@/components/NuevoContactoModal";
import { SideBar } from "@/components/SideBar";
import type { Cliente } from "@/interfaces/Cliente";
import { getContactos } from "@/services/contactos/getContactos";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ScaleLoader } from "react-spinners";

const Clientes = () => {
  const [clienteAEditar, setClienteAEditar] = useState<Cliente | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "propietario" | "interesado">("todos");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  const { data: clientes = [], isLoading: cargandoContactos } = useQuery<Cliente[]>({
    queryKey: ["admin_contactos"],
    queryFn: () => getContactos(),
  });

  const handleOpenEdit = (cliente: Cliente) => {
    setModalAbierto(true);
    setClienteAEditar(cliente);
  };

  const totalClientes = clientes.length;
  const propietariosCount = clientes.filter((c) => c.roles.esPropietario === true).length;
  const interesadosCount = clientes.filter((c) => c.roles.esBuscador === false).length;

  const clientesFiltrados = clientes
    .filter((cliente) => {
      if (filtroTipo === "todos") return true;
      if (filtroTipo === "propietario") return cliente.roles.esPropietario;
      if (filtroTipo === "interesado" || filtroTipo === "buscador") return cliente.roles.esBuscador;

      return true;
    })
    .filter((cliente) => {
      const termino = busqueda.toLowerCase();
      return (
        cliente.nombre.toLowerCase().includes(termino) ||
        cliente.email.toLowerCase().includes(termino) ||
        cliente.telefono.includes(termino)
      );
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

              <div className="flex-1 flex flex-col  p-1 max-w-7xl mx-auto">
                {/* ENCABEZADO */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Base de Clientes (CRM)</h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Administrá tu cartera de propietarios e interesados. Vinculá sus búsquedas y propiedades desde un
                      solo lugar.
                    </p>
                  </div>
                  <button
                    onClick={() => setModalAbierto(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <Plus size={16} />
                    <span>Nuevo Contacto</span>
                  </button>
                </div>

                {/* TARJETAS DE MÉTRICAS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm/50 flex flex-col justify-between">
                    <span className="text-sm font-medium text-slate-500">Cartera Total</span>
                    <span className="text-3xl font-bold text-slate-900 mt-2">{totalClientes}</span>
                  </div>
                  <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-100 flex flex-col justify-between">
                    <span className="text-sm font-medium text-purple-700">Propietarios</span>
                    <span className="text-3xl font-bold text-purple-800 mt-2">{propietariosCount}</span>
                  </div>
                  <div className="bg-teal-50/60 p-5 rounded-2xl border border-teal-100 flex flex-col justify-between">
                    <span className="text-sm font-medium text-teal-700">Buscadores / Interesados</span>
                    <span className="text-3xl font-bold text-teal-800 mt-2">{interesadosCount}</span>
                  </div>
                </div>

                {/* BARRA DE BÚSQUEDA Y FILTROS */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-4">
                  {/* Pestañas de Tipo */}
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start">
                    {(["todos", "propietario", "interesado"] as const).map((tipo) => (
                      <button
                        key={tipo}
                        onClick={() => setFiltroTipo(tipo)}
                        className={`text-xs px-4 py-2 font-bold rounded-lg transition-all capitalize cursor-pointer ${
                          filtroTipo === tipo
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {tipo === "todos" ? "Todos" : tipo === "propietario" ? "Propietarios" : "Interesados"}
                      </button>
                    ))}
                  </div>

                  {/* Input de Búsqueda */}
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Buscar por nombre, email o teléfono..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full text-sm bg-white border border-slate-200 rounded-xl py-2 px-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">🔍</span>
                  </div>
                </div>

                {/* TABLA DE CLIENTES */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  {cargandoContactos ? (
                    <div className="flex flex-col items-center justify-center p-12 gap-2">
                      <ScaleLoader />
                      <p className="text-sm text-slate-500">Cargando cartera de contactos...</p>
                    </div>
                  ) : clientesFiltrados.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                      No se encontraron clientes que coincidan con la búsqueda.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-6">Cliente / Contacto</th>
                            <th className="py-4 px-6">Rol</th>
                            <th className="py-4 px-6">Notas</th>
                            <th className="py-4 px-6">Alta</th>
                            <th className="py-4 px-6 text-right">Ficha</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                          {clientesFiltrados.map((cliente) => (
                            <tr key={cliente.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-6">
                                <div className="font-semibold text-slate-900">{cliente.nombre}</div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                  {cliente.email} • {cliente.telefono}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                    cliente.roles.esPropietario === true
                                      ? "bg-purple-50 text-purple-700 border-purple-200"
                                      : "bg-teal-50 text-teal-700 border-teal-200"
                                  }`}
                                >
                                  {cliente.roles.esPropietario === true ? "Propietario" : "Interesado"}
                                </span>
                              </td>
                              <td className="py-4 px-6 max-w-xs truncate font-medium text-slate-600">
                                {cliente.roles.esPropietario === true ? (
                                  <span className="text-purple-700">
                                    🏠 {cliente.propiedades?.length || 0} propiedades asignadas
                                  </span>
                                ) : (
                                  <span className="text-slate-600 italic">
                                    🎯 {cliente.notas || "Sin preferencias cargadas"}
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-slate-500">
                                {new Date(cliente.created_at).toLocaleDateString("es-AR")}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => setClienteSeleccionado(cliente)}
                                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                >
                                  Ver Perfil
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* MODAL: FICHA DE PERFIL DEL CLIENTE */}
                {clienteSeleccionado && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-slate-200 flex flex-col gap-5 animate-scale-up">
                      {/* Cabecera Ficha */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                        <div>
                          <span
                            className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md border ${
                              clienteSeleccionado.roles.esPropietario === true
                                ? "bg-purple-50 border-purple-200 text-purple-700"
                                : "bg-teal-50 border-teal-200 text-teal-700"
                            }`}
                          >
                            Ficha {clienteSeleccionado.roles.esPropietario === true ? "Propietario" : "Interesado"}
                          </span>
                          <div className="flex gap-3">
                            <h3 className="text-xl font-bold text-slate-900 mt-1">{clienteSeleccionado.nombre}</h3>
                            <h3 className="text-xl font-bold text-slate-900 mt-1">{clienteSeleccionado.apellido}</h3>
                          </div>
                        </div>
                        <button
                          onClick={() => setClienteSeleccionado(null)}
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

                      {/* Canales de Contacto Rápido */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="text-xs">
                          <p className="text-slate-400 font-medium">Email institucional</p>
                          <p className="text-sm font-bold text-slate-800">{clienteSeleccionado.email}</p>
                          <p className="text-slate-400 font-medium mt-1">Teléfono</p>
                          <p className="text-sm font-bold text-slate-800">{clienteSeleccionado.telefono}</p>
                        </div>
                        <div className="flex sm:flex-col gap-2 shrink-0">
                          <a
                            href={`https://wa.me/${clienteSeleccionado.telefono.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-center text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-2 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          >
                            Enviar WhatsApp 📲
                          </a>
                          <a
                            href={`mailto:${clienteSeleccionado.email}`}
                            className="text-center text-xs bg-blue-50 text-blue-700 font-bold px-3 py-2 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            Redactar Email ✉️
                          </a>
                        </div>
                      </div>

                      {/* Segmento Dinámico según tipo de Cliente */}
                      <div>
                        {clienteSeleccionado.roles.esPropietario === true ? (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                              Propiedades en catálogo
                            </span>
                            {clienteSeleccionado.propiedades && clienteSeleccionado.propiedades.length > 0 ? (
                              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {clienteSeleccionado.propiedades.map((prop) => (
                                  <div
                                    key={prop.id}
                                    className="p-3 border border-slate-200 rounded-xl bg-white flex justify-between items-center shadow-xs"
                                  >
                                    <div className="truncate pr-2">
                                      <span className="text-sm font-bold text-slate-800 block truncate">
                                        {prop.titulo}
                                      </span>
                                      <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                                        Operación: {prop.tipoOperacion}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 italic">
                                Este propietario no tiene propiedades asignadas actualmente.
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                              Preferencias de Búsqueda
                            </span>

                            <div className="p-4 bg-teal-50/40 border border-teal-100 rounded-xl space-y-3">
                              {/* Badges de atributos clave */}
                              <div className="flex flex-wrap gap-2">
                                {clienteSeleccionado.busqueda.tipoOperacion && (
                                  <span className="px-2.5 py-1 bg-teal-100/80 text-teal-800 text-xs font-semibold rounded-lg uppercase tracking-wide">
                                    {clienteSeleccionado.busqueda.tipoOperacion}
                                  </span>
                                )}

                                {clienteSeleccionado.busqueda.tipoPropiedad && (
                                  <span className="px-2.5 py-1 bg-teal-100/80 text-teal-800 text-xs font-semibold rounded-lg uppercase tracking-wide">
                                    {clienteSeleccionado.busqueda.tipoPropiedad}
                                  </span>
                                )}

                                {clienteSeleccionado.busqueda.presupuestoMax && (
                                  <span className="px-2.5 py-1 bg-emerald-100/80 text-emerald-800 text-xs font-semibold rounded-lg tracking-wide">
                                    Máx: USD {clienteSeleccionado.busqueda.presupuestoMax}
                                  </span>
                                )}
                              </div>

                              {/* Zonas / Descripción */}
                              <div className="flex w-fit items-center text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 gap-1.5 py-1 px-2 rounded-md  ">
                                <MapPin size={15} />
                                <span>
                                  {clienteSeleccionado.busqueda.zonas ||
                                    "No especificado explícitamente por el buscador"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Notas de Seguimiento Interno */}
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Historial y Notas Internas
                        </span>
                        <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/60 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-line">
                          {clienteSeleccionado.notas ||
                            "Sin anotaciones comerciales guardadas en el perfil de este cliente."}
                        </p>
                      </div>

                      {/* Pie de modal */}
                      <div className="border-t border-slate-100 pt-3 text-right flex justify-between items-center">
                        <button
                          onClick={() => handleOpenEdit(clienteSeleccionado)}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        >
                          Editar Cliente
                        </button>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Cliente registrado el {new Date(clienteSeleccionado.created_at).toLocaleDateString("es-AR")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
        <NuevoContactoModal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} />
        <EditarClienteModal
          key={clienteAEditar?.id || "modal-cerrado"}
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          cliente={clienteAEditar}
          setClienteSeleccionado={setClienteSeleccionado}
        />
      </div>
    </>
  );
};

export default Clientes;
