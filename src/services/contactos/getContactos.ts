import api from "@/config/axios";
import type { Cliente } from "@/interfaces/Cliente";

export const getContactos = async (): Promise<Cliente[]> => {
  const url = `/clientes`;

  const { data } = await api(url);

  if (data.ok != true) throw new Error("Error al obtener datos");

  return data.data;
};
