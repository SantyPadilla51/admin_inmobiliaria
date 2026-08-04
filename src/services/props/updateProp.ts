import api from "@/config/axios";
import { toast } from "react-hot-toast";

interface PropiedadFormData {
  id?: number;
  imagenes: string[];
  [key: string]: any;
}

interface ActualizarPropiedadOptions {
  formData: PropiedadFormData;
  setLoading: (loading: boolean) => void;
  blobToBase64Fn: (url: string) => Promise<string>;
}

export const ejecutarActualizacionPropiedad = async ({
  formData,
  setLoading,
  blobToBase64Fn,
}: ActualizarPropiedadOptions): Promise<void> => {
  setLoading(true);

  try {
    const imagenesProcesadas = await Promise.all(
      formData.imagenes.map(async (img) => {
        if (img.startsWith("blob:")) {
          return await blobToBase64Fn(img);
        }
        return img;
      }),
    );

    const url = `/propiedades/${formData.id}`;

    // 2. Petición HTTP
    const { data } = await api.put(url, {
      ...formData,
      imagenes: imagenesProcesadas,
    });

    if (data.ok === true) {
      toast.success(data.msg, {
        position: "bottom-right",
      });

      setTimeout(() => {
        window.location.href = "/admin/propiedades";
      }, 2000);
    } else {
      toast.error(data.msg, {
        position: "bottom-right",
      });
    }
  } catch (error) {
    toast.error("Error de red o servidor caído", {
      position: "bottom-right",
    });
  } finally {
    setLoading(false);
  }
};
