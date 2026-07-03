import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast, Toaster } from "react-hot-toast";
import { Spinner } from "../../components/ui/spinner";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "https://backend-inmobiliaria-argenta.vercel.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        },
      );

      const data = await response.json();

      if (data.ok != true) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-custom-enter" : "animate-custom-leave"
            } max-w-md w-full bg-red-50 shadow-lg rounded-lg pointer-events-auto flex border border-red-200`}
          >
            <div className="flex-1 w-0 p-4">
              <p className="text-sm font-medium text-black">{data.msg} ❌ </p>
            </div>
          </div>
        ));
        setLoading(false);
        return;
      } else {
        const { token, user } = data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "/admin/dashboard";
      }
    } catch (error: any) {
      setLoading(false);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-custom-enter" : "animate-custom-leave"
          } max-w-md w-full bg-red-50 shadow-lg rounded-lg pointer-events-auto flex border border-red-200`}
        >
          <div className="flex-1 w-0 p-4">
            <p className="text-sm font-medium text-black">
              {error.message} ❌{" "}
            </p>
          </div>
        </div>
      ));
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-slate-900">
        <img
          src="/login.webp"
          alt="Propiedad de lujo"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Panel de Control <br />
            Inmobiliaria Argenta.
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            Gestioná el catálogo de propiedades, administrá clientes y supervisá
            las operaciones de Buenos Aires desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center justify-center p-8 lg:p-16 bg-slate-50 relative">
        {loading && (
          <div className="absolute top-10 right-10 animate-pulse flex items-center gap-2 text-blue-700 font-semibold">
            <Spinner /> <span>Cargando...</span>
          </div>
        )}

        <div className="w-full max-w-md space-y-8">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Bienvenido de nuevo
            </h1>
            <p className="text-slate-500 mt-2">
              Ingresá tus datos para gestionar tu cuenta.
            </p>
          </div>

          <form id="auth-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="h-12 bg-slate-300! border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <a
                  href="#"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <div className="relative flex items-center">
                <Input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  className="h-12 w-full bg-slate-300! border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all pr-12" // pr-12 evita que el texto tape al ojo
                  required
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                {/* Botón del Ojo */}
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1"
                >
                  {mostrarPassword ? (
                    // Icono: Ojo Tachado
                    <svg
                      className="hover:cursor-pointer h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    // Icono: Ojo Abierto
                    <svg
                      className="hover:cursor-pointer h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {loading ? (
              <Button
                type="submit"
                disabled
                className="w-full h-12 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg "
                form="auth-form"
              >
                Cargando...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-12 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg "
                form="auth-form"
              >
                Iniciar Sesión
              </Button>
            )}
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            ¿Todavía no tenés cuenta?{" "}
            <Link
              to="/auth/register"
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              Registrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
