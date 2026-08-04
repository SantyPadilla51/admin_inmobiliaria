import api from "@/config/axios";
import { toast } from "react-hot-toast";

interface EliminarPropiedadOptions {
  id?: number;
  setDeleting: (deleting: boolean) => void;
}

export const ejecutarEliminacionPropiedad = async ({
  id,
  setDeleting,
}: EliminarPropiedadOptions): Promise<void> => {
  setDeleting(true);
  const url = `/propiedades/${id}`;

  try {
    const { data } = await api.delete(url);

    if (data.ok === true) {
      toast.success(data.msg || "Propiedad eliminada con éxito", {
        position: "top-right",
      });

      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1500);
    } else {
      console.error("Error en la respuesta:", data.msg);
      toast.error(data.msg || "Hubo un error al eliminar la propiedad", {
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error de red o servidor caído:", error);
    toast.error("Error de red o servidor caído", {
      position: "top-right",
    });
  } finally {
    setDeleting(false);
  }
};
