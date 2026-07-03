import PropertyFilters from "../components/PropertyFilters";
import GridProp from "../components/GridProp";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-slate-50/50 font-sans text-slate-800 antialiased">
      <main className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <section className="flex-1 overflow-y-auto p-8 bg-linear-to-b from-white to-slate-50/30">
          <div className="max-w-7xl mx-auto space-y-8">
            <PropertyFilters />
            <GridProp />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
