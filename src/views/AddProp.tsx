import { SideBar } from "@/components/SideBar";
import FormProp from "../components/FormProp";
import Navbar from "../components/Navbar";

const AddProp = () => {
  return (
    <>
      <div className="flex  bg-slate-50/50 font-sans text-slate-800 antialiased">
        <main className="flex-1 flex flex-col overflow-hidden">
          <Navbar />

          <section className=" p-8 bg-linear-to-b from-white to-slate-50/30">
            <div className="flex w-full mx-auto gap-8 p-4">
              <aside className="w-72 ">
                <SideBar />
              </aside>

              <section className="w-full mx-auto">
                <FormProp />
              </section>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default AddProp;
