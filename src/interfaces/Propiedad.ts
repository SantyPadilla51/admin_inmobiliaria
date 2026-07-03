export interface Propiedad {
  id?: number;
  titulo: string;
  direccion: string;
  calle: string;
  descripcion: string;
  habitaciones: string;
  precio: string;
  barrio: string;
  wc: string;
  expensas: string;
  operacion: string;
  cochera: string;
  tipo: string;
  imagenes: string[];
  amenities: string[];
}

export class PropiedadModelo implements Propiedad {
  titulo = "";
  direccion = "";
  calle = "";
  descripcion = "";
  habitaciones = "";
  precio = "";
  barrio = "";
  wc = "";
  expensas = "";
  operacion = "";
  cochera = "";
  tipo = "";
  imagenes = [];
  amenities = [];
}

export interface EditPropProps {
  prop: Propiedad;
}
