import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditProp from "./EditProp";
import type { Propiedad } from "../interfaces/Propiedad";
import Navbar from "../components/Navbar";

const EditPropPage = () => {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);

  useEffect(() => {
    const fetchPropiedad = async () => {
      const request = await fetch(
        `https://backend-inmobiliaria-argenta.vercel.app/propiedades/${id}`,
      );
      const data = await request.json();
      setPropiedad(data.data);
    };

    fetchPropiedad();
  }, []);

  if (!propiedad) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <main className="py-10 px-4 sm:px-6">
          <div className="text-center">
            <p className="text-black animate-pulse">
              Cargando datos de la propiedad...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
        <Navbar />

        <main className=" py-10 px-4 sm:px-6">
          <EditProp prop={propiedad} />
        </main>
      </div>
    </>
  );
};

export default EditPropPage;
