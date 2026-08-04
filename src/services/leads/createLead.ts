import api from "@/config/axios";
import toast from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";

export const createLead = async (
  e: React.FormEvent,
  queryClient: QueryClient,
  nuevoLead: any,
  propiedades: any[],
  setCargando: any,
  setNuevoLead: (data: any) => void,
  setModalNuevoOpen: (open: boolean) => void,
) => {
  e.preventDefault();

  setCargando(true);

  if (!nuevoLead.nombre || !nuevoLead.telefono || !nuevoLead.propiedadId) {
    toast.error("Por favor, completá los campos obligatorios (*)");
    return;
  }

  const propiedadElegida = propiedades.find(
    (p) => p.id?.toString() === nuevoLead.propiedadId,
  );

  if (!propiedadElegida) {
    toast.error("La propiedad seleccionada no es válida");
    return;
  }

  try {
    const url = "/consultas";
    const data = await api.post(url, nuevoLead);

    queryClient.invalidateQueries({ queryKey: ["admin_leads"] });

    setModalNuevoOpen(false);

    setNuevoLead({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "",
      fuente: "",
      propiedadId: "",
    });
  } catch (error) {
    toast.error("Error al registrar la consulta");
  } finally {
    setCargando(false);
  }
};
