export interface Visita {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  propiedad_id: string;
  fecha: string;
  estado: "pendiente" | "confirmada" | "realizada" | "cancelada";
  notas?: string;
}
