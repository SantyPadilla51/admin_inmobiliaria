import api from "@/config/axios";
import toast from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";
import type { Lead } from "@/interfaces/Lead";

export const updateLead = async (
  id: string,
  nuevoEstado: string,
  queryClient: QueryClient,
  setCargando: (open: boolean) => void,
  setLeadSeleccionado: React.Dispatch<React.SetStateAction<Lead | null>>,
) => {
  setCargando(true);
  try {
    const url = `/consultas/${id}`;

    const { data } = await api.patch(url, { estado: nuevoEstado });

    if (data.ok === true) {
      await queryClient.invalidateQueries({ queryKey: ["admin_leads"] });
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
      setLeadSeleccionado(null);
    }
  } catch {
    toast.error("Error al actualizar el lead", {
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
