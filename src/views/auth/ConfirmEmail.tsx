import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ConfirmEmail = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [mensaje, setMensaje] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMensaje(
        "El enlace de confirmación no es válido o le falta el token de seguridad.",
      );
    }
  }, [token]);

  const manejarConfirmacion = async () => {
    if (!token) return;

    setLoading(true);
    setStatus("idle");

    try {
      const respuesta = await fetch(
        `https://backend-inmobiliaria-argenta.vercel.app/auth/confirm-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        },
      );

      const data = await respuesta.json();

      if (!data.ok) {
        throw new Error(data.msg || "Hubo un problema al confirmar tu cuenta.");
      }

      setStatus("success");
      setMensaje(
        "¡Tu cuenta ha sido verificada con éxito! Ya podés iniciar sesión.",
      );

      setTimeout(() => {
        navigate("/");
      }, 3500);
    } catch (error: any) {
      setStatus("error");
      setMensaje(error.message || "Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Encabezado estético */}
        <div className="bg-blue-900 py-8 px-6 text-center">
          <h1 className="text-white font-bold text-2xl tracking-tight">
            Inmobiliaria Argenta
          </h1>
          <p className="text-blue-200 text-sm mt-1">Verificación de perfil</p>
        </div>

        {/* Cuerpo del Componente */}
        <div className="p-8 text-center">
          {status === "idle" && (
            <>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">
                ¡Estás a un solo clic!
              </h2>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Presioná el botón de abajo para activar tu cuenta de forma
                segura y empezar a publicar tus propiedades.
              </p>

              <button
                onClick={manejarConfirmacion}
                disabled={loading}
                className="w-full hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    {/* Spinner de Tailwind */}
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Confirmando...
                  </>
                ) : (
                  "Confirmar mi cuenta"
                )}
              </button>
            </>
          )}

          {/* Estado de Éxito */}
          {status === "success" && (
            <div className="animate-fade-in">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 mb-4">
                <svg
                  className="h-8 w-8 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                ¡Todo listo!
              </h2>
              <p className="text-sm text-slate-600 mb-4">{mensaje}</p>
              <p className="text-xs text-slate-400 animate-pulse">
                Redirigiéndote al login...
              </p>
            </div>
          )}

          {/* Estado de Error */}
          {status === "error" && (
            <div className="animate-fade-in">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-rose-100 mb-4">
                <svg
                  className="h-8 w-8 text-rose-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                No se pudo verificar
              </h2>
              <p className="text-sm text-slate-600 mb-6">{mensaje}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
