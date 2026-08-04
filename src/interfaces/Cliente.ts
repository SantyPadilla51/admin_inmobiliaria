export interface RolesCliente {
  esPropietario: boolean;
  esBuscador: boolean;
}

export interface BusquedaCliente {
  tipoOperacion: "venta";
  tipoPropiedad: "Departamento";
  presupuestoMax: "";
  zonas: "";
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  created_at: string;
  roles: RolesCliente;
  propiedades?: string[];
  busqueda: BusquedaCliente;
  notas: string;
}
