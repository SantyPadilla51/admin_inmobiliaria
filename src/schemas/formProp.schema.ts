import { z } from "zod";

export const formSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  tipo: z.string().min(1, "Selecciona un tipo."),
  calle: z.string().min(1, "La calle es obligatoria."),
  direccion: z.string().min(1, "La altura es obligatoria."),
  barrio: z.string().min(1, "Selecciona un barrio."),
  habitaciones: z.string().min(1, "Selecciona cantidad."),
  wc: z.string().min(1, "Selecciona cantidad de baños."),
  cochera: z.string().min(1, "Selecciona si tiene cochera."),
  precio: z.string().min(1, "El precio es obligatorio."),
  expensas: z.string().min(1, "Las expensas son obligatorias."),
  amenities: z.array(z.string()),
  descripcion: z.string().min(10, "Escribe una descripción más detallada."),
});
