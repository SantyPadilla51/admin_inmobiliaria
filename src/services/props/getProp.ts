import api from "@/config/axios";
import type { Propiedad } from "@/interfaces/Propiedad";

export const getProp = async (id: string): Promise<Propiedad> => {
  const url = `/propiedades/${id}`;

  const { data } = await api(url);

  if (data.ok != true) throw new Error("Error al obtener datos");

  return data.data;
};
