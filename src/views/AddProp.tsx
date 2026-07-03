import FormProp from "../components/FormProp";
import Navbar from "../components/Navbar";

const AddProp = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
        <Navbar />

        <main className="  py-10 px-4 sm:px-6">
          <FormProp />
        </main>
      </div>
    </>
  );
};

export default AddProp;
