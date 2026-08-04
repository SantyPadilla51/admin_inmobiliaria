import api from "@/config/axios";
import type { Cliente } from "@/interfaces/Cliente";
import type { QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Definimos los datos a actualizar omitiendo propiedades de solo lectura como created_at
export type UpdateClienteData = Partial<Omit<Cliente, "created_at">> & { id: string };

export const updateContacto = async (
  contacto: UpdateClienteData,
  queryClient: QueryClient,
  setCargando: (open: boolean) => void,
) => {
  setCargando(true);
  const { id, ...payload } = contacto;

  try {
    const { data } = await api.put(`/clientes/${id}`, payload);

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
      return data;
    }
  } catch {
    toast.error("Error al editar el contacto", {
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
