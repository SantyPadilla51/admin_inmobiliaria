import PropertyFilters from "../components/PropertyFilters";
import GridProp from "../components/GridProp";
import Navbar from "../components/Navbar";
import { SideBar } from "@/components/SideBar";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-slate-50/50 font-sans text-slate-800 antialiased">
      <main className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <section className=" p-8 bg-linear-to-b from-white to-slate-50/30">
          <div className="flex w-full mx-auto gap-8 p-4">
            <aside className="w-72  sticky">
              <SideBar />
            </aside>

            <main className="flex-1 flex flex-col gap-8">
              <PropertyFilters />
              <GridProp />
            </main>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
