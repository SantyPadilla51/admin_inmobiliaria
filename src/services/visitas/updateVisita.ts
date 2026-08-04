import type { Visita } from "@/interfaces/Visita";
import api from "../../config/axios";
import toast from "react-hot-toast";
import type { QueryClient } from "@tanstack/react-query";

export const updateVisita = async (
  visitaId: string,
  visita: Visita,
  setCargando: (open: boolean) => void,
  setVisitaSeleccionada: (visita: Visita | null) => void,
  queryClient: QueryClient,
) => {
  setCargando(true);

  try {
    const { data } = await api.put(`/visitas/${visitaId}`, visita);

    if (data.ok === true) {
      await queryClient.invalidateQueries({ queryKey: ["admin_visitas"] });
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
      setVisitaSeleccionada(null);
    }
  } catch {
    toast.error("Error al actualizar la visita", {
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
