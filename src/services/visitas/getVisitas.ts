import api from "@/config/axios";
import type { Visita } from "@/interfaces/Visita";

export const getVisitas = async (): Promise<Visita[]> => {
  const url = `/visitas`;

  const { data } = await api(url);

  if (data.ok != true) throw new Error("Error al obtener datos");

  return data.data;
};
