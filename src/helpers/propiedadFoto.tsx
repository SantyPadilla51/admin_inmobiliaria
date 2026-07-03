import { optimizarImagen } from "../helpers/optimizarImagen";

export const PropiedadFoto = ({ prop }: any) => {
  const urlOriginal = prop.imagenes?.[0];

  const urlOptimizada = optimizarImagen(urlOriginal);

  if (!urlOptimizada) {
    return (
      <div className="bg-light d-flex align-items-center justify-center h-64">
        <span>Cargando...</span>
      </div>
    );
  }

  return <img src={urlOptimizada} className="img-fluid" />;
};
