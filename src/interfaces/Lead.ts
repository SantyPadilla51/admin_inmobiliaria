export interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  fuente: string;
  estado: "pendiente" | "en_proceso" | "finalizado";
  propiedad_id: string;
  created_at: string;
}
