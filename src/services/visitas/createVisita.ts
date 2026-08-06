import api from "@/config/axios";
import { QueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction, FormEvent } from "react";
import toast from "react-hot-toast";

export interface NuevaVisitaState {
  nombre: string;
  telefono: string;
  email?: string;
  fecha: string;
  hora: string;
  propiedadId: string;
  notas?: string;
}

export const createVisita = async (
  e: FormEvent,
  queryClient: QueryClient,
  nuevaVisita: NuevaVisitaState,
  setCargando: (open: boolean) => void,
  setNuevaVisita: Dispatch<SetStateAction<NuevaVisitaState>>,
  setModalNuevoVisitaOpen: (open: boolean) => void,
) => {
  e.preventDefault();

  try {
    setCargando(true);

    if (
      !nuevaVisita.nombre ||
      !nuevaVisita.telefono ||
      !nuevaVisita.propiedadId ||
      !nuevaVisita.fecha ||
      !nuevaVisita.hora
    ) {
      toast.error("Por favor completa todos los campos obligatorios.", {
        icon: "❌",
        position: "bottom-right",
        style: {
          border: "2px solid #ef4444",
          color: "#7f1d1d",
          backgroundColor: "#fef2f2",
          borderRadius: "20px",
        },
      });
      setCargando(false);
      return;
    }

    const fechaHoraCombinada = new Date(`${nuevaVisita.fecha}T${nuevaVisita.hora}:00`).toISOString();

    const payload = {
      nombre: nuevaVisita.nombre,
      telefono: nuevaVisita.telefono,
      email: nuevaVisita.email || null,
      propiedad_id: nuevaVisita.propiedadId,
      fecha: fechaHoraCombinada,
      notas: nuevaVisita.notas || "",
      estado: "a_confirmar",
    };

    const { data } = await api.post("/visitas", payload);

    if (data.ok === true) {
      await queryClient.invalidateQueries({ queryKey: ["admin_visitas"] });

      toast.success(data.msg, {
        duration: 4000,
        icon: "✅",
        position: "bottom-right",
        style: {
          border: "2px solid #22c55e",
          color: "#14532d",
          backgroundColor: "#f0fdf4",
          borderRadius: "20px",
        },
      });

      setNuevaVisita({
        nombre: "",
        telefono: "",
        email: "",
        fecha: new Date().toISOString().split("T")[0],
        hora: "10:00",
        propiedadId: "",
        notas: "",
      });

      setModalNuevoVisitaOpen(false);
    }
  } catch {
    toast.error("Ocurrió un error al agendar la visita.", {
      duration: 4000,
      icon: "❌",
      position: "bottom-right",
      style: {
        border: "2px solid #ef4444",
        color: "#7f1d1d",
        backgroundColor: "#fef2f2",
        borderRadius: "20px",
      },
    });
  } finally {
    setCargando(false);
  }
};
