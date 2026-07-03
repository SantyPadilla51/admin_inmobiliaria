export const getPropiedades = async (filtros: {
  barrio?: string | null;
  tipo?: string | null;
  operacion?: string | null;
}) => {
  const params = new URLSearchParams();
  if (filtros.barrio) params.append("barrio", filtros.barrio);
  if (filtros.tipo) params.append("tipo", filtros.tipo);
  if (filtros.operacion) params.append("operacion", filtros.operacion);

  const query = new URLSearchParams(params).toString();
  const url = `https://backend-inmobiliaria-argenta.vercel.app/propiedades?${query}`;

  const response = await fetch(url);

  if (!response.ok) throw new Error("Error al obtener datos");

  const data = await response.json();

  return data.propiedades;
};
