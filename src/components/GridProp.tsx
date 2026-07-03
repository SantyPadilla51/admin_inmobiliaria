import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Edit3, MapPin } from "lucide-react";
import { PropiedadFoto } from "../helpers/propiedadFoto";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Propiedad } from "../interfaces/Propiedad";
import { getPropiedades } from "../actions/getProps";
import type { CustomCardProps } from "../interfaces/CustomProps";

const GridProp = ({ barrio, tipo, operacion }: CustomCardProps) => {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const tipoUrl = searchParams.get("tipo") || tipo;
  const barrioUrl = searchParams.get("barrio") || barrio;
  const operacionUrl = searchParams.get("operacion") || operacion;

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);

      try {
        const data = await getPropiedades({
          barrio: barrioUrl,
          tipo: tipoUrl,
          operacion: operacionUrl,
        });

        setPropiedades(data);
      } catch (error) {
        console.error("Error al cargar propiedades:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [searchParams]);

  if (cargando) {
    return (
      <div className="flex h-screen overflow-hidden bg-black font-sans">
        <main className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <p className="text-black animate-pulse">
              Cargando datos de la propiedad...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (propiedades.length == 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-black font-sans">
        <main className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <p className="text-black ">No se encontraron propiedades</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {propiedades.map((prop) => (
        <Card
          key={prop.id}
          className="overflow-hidden bg-white rounded-2xl border border-slate-200/70 flex flex-col h-full shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-300 group"
        >
          <div className="relative mt-3 mx-3 aspect-4/3 overflow-hidden rounded-xl bg-slate-100 shrink-0">
            {prop.imagenes && prop.imagenes.length > 0 ? (
              <div className="w-full h-full object-cover">
                <PropiedadFoto prop={prop} />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500 text-xs font-semibold">
                Sin foto disponible
              </div>
            )}

            {/* Badge Dinámico: Alquiler / Venta */}
            <span
              className={`absolute top-2.5 left-2.5 text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm text-white ${
                prop.operacion === "alquiler" ? "bg-blue-600" : "bg-emerald-600"
              }`}
            >
              {prop.operacion}
            </span>
          </div>

          {/* Contenido  */}
          <CardContent className="p-5 flex flex-col grow bg-white">
            <div className="flex flex-col gap-1.5 mb-2">
              <h3 className="font-bold text-slate-900  ">{prop.titulo}</h3>

              <span className="text-emerald-600 font-extrabold text-lg tracking-tight self-start">
                {(() => {
                  const precioNumero = Number(prop.precio);

                  if (!isNaN(precioNumero)) {
                    return new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      maximumFractionDigits: 0,
                    }).format(precioNumero);
                  }

                  return `$ ${prop.precio}`;
                })()}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mb-4">
              <MapPin size={14} className="text-slate-400 shrink-0" />
              <span className="capitalize line-clamp-1">{prop.barrio}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 px-2 mt-auto bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-xs font-semibold">
              {/* Habitaciones */}
              <div className="flex flex-col items-center gap-1 text-center border-r border-slate-200/60 last:border-0">
                <span className="text-slate-400 font-normal">Hab.</span>
                <span className="text-slate-800 flex items-center gap-1">
                  {prop.habitaciones || 0}
                </span>
              </div>

              {/* Baños */}
              <div className="flex flex-col items-center gap-1 text-center border-r border-slate-200/60 last:border-0">
                <span className="text-slate-400 font-normal">Baños</span>
                <span className="text-slate-800">{prop.wc || 0}</span>
              </div>

              {/* Cochera */}
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-slate-400 font-normal">Cochera</span>
                <span className="text-slate-800 text-[11px] truncate max-w-full capitalize">
                  {prop.cochera}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-5 pb-5 pt-0 flex gap-2 bg-white">
            <Link
              to={`/admin/editar-propiedad/${prop.id}`}
              className="w-full flex justify-center py-2.5 px-4 rounded-xl text-white bg-slate-900 hover:bg-blue-600 text-sm font-semibold gap-2 cursor-pointer items-center transition-all duration-200 shadow-sm shadow-slate-900/5 active:scale-[0.98]"
            >
              <Edit3 size={15} />
              Editar publicación
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default GridProp;
