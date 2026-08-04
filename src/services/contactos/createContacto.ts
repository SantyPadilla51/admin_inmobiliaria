import api from "../../config/axios";
import toast from "react-hot-toast";
import type { QueryClient } from "@tanstack/react-query";
import type { ContactoFormData } from "@/components/NuevoContactoModal";

export const createContacto = async (
  contacto: ContactoFormData,
  setCargando: (open: boolean) => void,
  queryClient: QueryClient,
) => {
  setCargando(true);

  try {
    const { data } = await api.post("/clientes", contacto);

    if (data.ok === true) {
      await queryClient.invalidateQueries({ queryKey: ["admin_contactos"] });
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
    toast.error("Error al registrar el contacto", {
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
