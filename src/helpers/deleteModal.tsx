import React from "react";
import { AlertTriangle, X } from "lucide-react"; // Si no usas lucide-react, puedes removerlos

interface ConfirmDeleteModalProps {
  deleteModal: boolean;
  setDeleteModal: (open: boolean) => void;
  onConfirm: (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent,
  ) => void | Promise<void>;
  cargando?: boolean;
  titulo?: string;
  mensaje?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  deleteModal,
  setDeleteModal,
  onConfirm,
  cargando = false,
  titulo = "Confirmar eliminación",
  mensaje = "¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.",
}) => {
  // Si deleteModal es false, no renderizamos nada
  if (!deleteModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      {/* Contenedor del Modal */}
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative flex flex-col gap-4 animate-scale-up">
        {/* Botón para cerrar (X) */}
        <button
          onClick={() => !cargando && setDeleteModal(false)}
          disabled={cargando}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado e Icono de advertencia */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-full text-red-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{titulo}</h3>
            <p className="text-xs text-slate-500">Acción irreversible</p>
          </div>
        </div>

        {/* Mensaje principal */}
        <p className="text-sm text-slate-600 leading-relaxed">{mensaje}</p>

        {/* Botones de Acción */}
        <div className="flex justify-end items-center gap-3 mt-2">
          <button
            type="button"
            onClick={() => setDeleteModal(false)}
            disabled={cargando}
            className="px-4 py-2 text-sm font-medium hover:cursor-pointer text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={cargando}
            className="px-4 py-2 text-sm font-medium hover:cursor-pointer text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-25"
          >
            {cargando ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin " />
                Eliminando...
              </span>
            ) : (
              "Eliminar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
