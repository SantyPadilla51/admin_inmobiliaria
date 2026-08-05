import type { ImageFile } from "@/components/FormProp";
import api from "@/config/axios";
import toast from "react-hot-toast";

interface dataProp {
  titulo: string;
  tipo: string;
  calle: string;
  direccion: string;
  barrio: string;
  habitaciones: string;
  wc: string;
  cochera: string;
  precio: string;
  expensas: string;
  amenities: string[];
  descripcion: string;
}

export const createProp = async (dataProp: dataProp, images: ImageFile[], setLoading: (open: boolean) => void) => {
  try {
    setLoading(true);
    const formData = new FormData();

    const precioLimpio = parseInt(dataProp.precio.replace(/[^0-9]/g, ""), 10) || 0;
    const expensasLimpias = parseInt(dataProp.expensas.replace(/[^0-9]/g, ""), 10) || 0;

    formData.append("titulo", dataProp.titulo);
    formData.append("barrio", dataProp.barrio);
    formData.append("habitaciones", dataProp.habitaciones);
    formData.append("wc", dataProp.wc);
    formData.append("descripcion", dataProp.descripcion);
    formData.append("operacion", "venta");
    formData.append("calle", dataProp.calle.trim());
    formData.append("cochera", dataProp.cochera);
    formData.append("tipo", dataProp.tipo);
    formData.append("direccion", dataProp.direccion);
    formData.append("amenities", JSON.stringify(dataProp.amenities));
    formData.append("precio", precioLimpio.toString());
    formData.append("expensas", expensasLimpias.toString());

    // Adjuntamos binarios de la galería
    images.forEach((imgObj) => {
      formData.append("imagenes", imgObj.file);
    });

    const url = "/propiedades";
    const res = await api.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data?.ok === true) {
      toast.success(res.data.msg, {
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
      // navigate("/admin/dashboard");
    }
  } catch {
    toast.error("Error al crear propiedad", {
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
    setLoading(false);
  }
};
