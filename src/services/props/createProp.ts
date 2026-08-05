import api from "@/config/axios";
import toast from "react-hot-toast";

export const createProp = async (data, images, setLoading) => {
  try {
    setLoading(true);
    const formData = new FormData();

    const precioLimpio = parseInt(data.precio.replace(/[^0-9]/g, ""), 10) || 0;
    const expensasLimpias = parseInt(data.expensas.replace(/[^0-9]/g, ""), 10) || 0;

    formData.append("titulo", data.titulo);
    formData.append("barrio", data.barrio);
    formData.append("habitaciones", data.habitaciones);
    formData.append("wc", data.wc);
    formData.append("descripcion", data.descripcion);
    formData.append("operacion", "venta");
    formData.append("calle", data.calle.trim());
    formData.append("cochera", data.cochera);
    formData.append("tipo", data.tipo);
    formData.append("direccion", data.direccion);
    formData.append("amenities", JSON.stringify(data.amenities));
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
      // navigate("/admin/dashboard");
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
    setLoading(false);
  }
};
