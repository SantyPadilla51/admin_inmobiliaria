import EditProp from "./EditProp";
import Navbar from "../components/Navbar";
import { getProp } from "@/services/props/getProp";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const EditPropPage = () => {
  const { id } = useParams();

  const { data: propiedad } = useQuery({
    queryKey: ["admin_propiedad"],

    queryFn: () => getProp(id!),
  });

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
