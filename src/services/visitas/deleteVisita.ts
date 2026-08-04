import api from "@/config/axios";
import type { QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const deleteVisita = async (
  id: string,
  setCargando: (open: boolean) => void,
  setDeleteModal: (open: boolean) => void,
  queryClient: QueryClient,
) => {
  setCargando(true);
  try {
    const { data } = await api.delete(`/visitas/${id}`);

    if (data.ok === true) {
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
      await queryClient.invalidateQueries({ queryKey: ["admin_visitas"] });
    }

    setDeleteModal(false);
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
