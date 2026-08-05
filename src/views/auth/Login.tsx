import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast, Toaster } from "react-hot-toast";
import { Spinner } from "../../components/ui/spinner";
import api from "@/config/axios";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "../../components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type FormPropsData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormPropsData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmitForm = async (datos: FormPropsData) => {
    try {
      setLoading(true);

      const url = "/auth/login";
      const { data } = await api.post(url, datos);

      if (data.ok === true) {
        const { token, user } = data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/admin/propiedades");
        setLoading(false);
      }
    } catch {
      setLoading(false);

      toast.error("Error al iniciar sesion", {
        style: {
          background: "rgba(18, 18, 18, 0.85)",
          color: "#f3f4f6",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 77, 79, 0.3)",
          borderRadius: "12px",
          padding: "14px 20px",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          fontSize: "14px",
          fontWeight: "500",
        },
        icon: "❌",
      });
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
            Gestioná el catálogo de propiedades, administrá clientes y supervisá las operaciones de Buenos Aires desde
            un solo lugar.
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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bienvenido de nuevo</h1>
            <p className="text-slate-500 mt-2">Ingresá tus datos para gestionar tu cuenta.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="space-y-2">
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Ingresa tu email"
                      aria-invalid={fieldState.invalid}
                      className="bg-white!  py-5"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="relative flex items-center">
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Password</FieldLabel>

                      {/* Contenedor relativo exclusivo para el Input y el Ojo */}
                      <div className="relative flex items-center ">
                        <Input
                          type={mostrarPassword ? "text" : "password"}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          className="bg-white! pr-10 py-5"
                        />

                        {/* El botón ahora vive aquí adentro, perfectamente centrado verticalmente */}
                        <button
                          type="button"
                          onClick={() => setMostrarPassword(!mostrarPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1"
                        >
                          {mostrarPassword ? (
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
                            <svg
                              className="hover:cursor-pointer h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            {loading ? (
              <Button
                type="submit"
                disabled
                className="w-full h-12 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg "
              >
                Cargando...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-12 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg "
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
