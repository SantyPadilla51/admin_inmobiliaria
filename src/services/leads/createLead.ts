import api from "@/config/axios";
import toast from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";
import type { Propiedad } from "@/interfaces/Propiedad";

interface LeadForm {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  fuente: string;
  propiedadId: string;
}

export const createLead = async (
  e: React.FormEvent,
  queryClient: QueryClient,
  nuevoLead: LeadForm,
  propiedades: Propiedad[],
  setCargando: (open: boolean) => void,
  setNuevoLead: (data: LeadForm) => void,
  setModalNuevoOpen: (open: boolean) => void,
) => {
  e.preventDefault();

  setCargando(true);

  if (!nuevoLead.nombre || !nuevoLead.telefono || !nuevoLead.propiedadId) {
    toast.error("Por favor, completá los campos obligatorios (*)");
    return;
  }

  const propiedadElegida = propiedades.find((p) => p.id?.toString() === nuevoLead.propiedadId);

  if (!propiedadElegida) {
    toast.error("La propiedad seleccionada no es válida");
    return;
  }

  try {
    const url = "/consultas";
    const { data } = await api.post(url, nuevoLead);

    if (data.ok === true) {
      queryClient.invalidateQueries({ queryKey: ["admin_leads"] });

      setModalNuevoOpen(false);

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

      setNuevoLead({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: "",
        fuente: "",
        propiedadId: "",
      });
    }
  } catch {
    toast.error("Error al crear lead", {
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
