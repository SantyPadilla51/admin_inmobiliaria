import api from "@/config/axios";
import type { Propiedad } from "@/interfaces/Propiedad";

export const getPropiedades = async (filtros?: {
  barrio?: string | null;
  tipo?: string | null;
  operacion?: string | null;
}): Promise<Propiedad[]> => {
  const params = new URLSearchParams();
  if (filtros?.barrio) params.append("barrio", filtros.barrio);
  if (filtros?.tipo) params.append("tipo", filtros.tipo);
  if (filtros?.operacion) params.append("operacion", filtros.operacion);

  const query = new URLSearchParams(params).toString();
  const url = `/propiedades?${query}`;

  const { data } = await api(url);

  if (data.ok != true) throw new Error("Error al obtener datos");

  return data.propiedades;
};
