import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./views/AdminDashboard";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import AddProp from "./views/AddProp";
import EditPropPage from "./views/EditPropPage";
import ConfirmEmail from "./views/auth/ConfirmEmail";
import ConsultasLeads from "./views/LeadsConsultas";
import Agenda from "./views/Agenda";
import Clientes from "./views/Clientes";
import Contratos from "./views/Contratos";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          <Route path="/admin/propiedades" element={<AdminDashboard />} />
          <Route path="/admin/consultas" element={<ConsultasLeads />} />
          <Route path="/admin/agenda" element={<Agenda />} />
          <Route path="/admin/clientes" element={<Clientes />} />
          <Route path="/admin/contratos" element={<Contratos />} />
          <Route path="/admin/add-prop" element={<AddProp />} />
          <Route
            path="/admin/editar-propiedad/:id"
            element={<EditPropPage />}
          />
          <Route path="/auth/confirm-email/:token" element={<ConfirmEmail />} />

          <Route path="*" element={<h1>404 - No encontrado</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
