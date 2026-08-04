import api from "@/config/axios";
import type { Lead } from "@/interfaces/Lead";

export const getLeads = async (): Promise<Lead[]> => {
  const url = `/consultas`;

  const { data } = await api(url);

  if (data.ok != true) throw new Error("Error al obtener datos");

  return data.data;
};
