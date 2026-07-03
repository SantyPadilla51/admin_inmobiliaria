import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../components/ui/field";
import { Edit3, Trash2 } from "lucide-react";
import type { EditPropProps, Propiedad } from "../interfaces/Propiedad";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from "../components/ui/select";
import {
  AMENITIES_LIST,
  BARRIOS,
  OPCIONES_BANOS,
  OPCIONES_HABITACIONES,
  OPERACION,
  TIPO_LIST,
} from "../constants/propiedades";
import { Textarea } from "../components/ui/textarea";
import toast from "react-hot-toast";
import { Checkbox } from "../components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { cleanNumericValue, formatCurrencyAR } from "../helpers/formatCurrency";

const EditProp = ({ prop }: EditPropProps) => {
  const [formData, setFormData] = useState<Propiedad>({ ...prop });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toastDeleteProp, setToastDeleteProp] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const blobToBase64 = async (blobUrl: string): Promise<string> => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const actualizarPropiedad = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const imagenesProcesadas = await Promise.all(
      formData.imagenes.map(async (img) => {
        if (img.startsWith("blob:")) {
          return await blobToBase64(img);
        }
        return img;
      }),
    );

    const url = `https://backend-inmobiliaria-argenta.vercel.app/propiedades/${formData.id}`;

    try {
      const request = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imagenes: imagenesProcesadas,
        }),
      });

      const result = await request.json();

      if (request.ok === true) {
        toast.success(result.msg, {
          position: "top-right",
        });
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      } else {
        toast.success(result.msg, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error de red o servidor caído:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const nuevasImagenesLocales = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );

    setFormData((prev) => ({
      ...prev,
      imagenes: [...(prev.imagenes || []), ...nuevasImagenesLocales],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const deleteProp = async () => {
    setDeleting(true);
    const url = `https://backend-inmobiliaria-argenta.vercel.app/propiedades/${formData.id}`;

    try {
      const request = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await request.json();

      if (result.ok === true) {
        toast.success(result.msg, {
          position: "top-right",
        });
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      } else {
        console.error("Error en la respuesta:", result.msg);
      }
    } catch (error) {
      console.error("Error de red o servidor caído:", error);
    }
  };

  return (
    <>
      {toastDeleteProp ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm overflow-hidden bg-white rounded-xl shadow-2xl dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 scale-up-animation">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 mb-4">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-950 dark:text-white">
                ¿Eliminar Propiedad?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Esta acción no se puede deshacer. El elemento se borrará
                permanentemente.
              </p>
            </div>

            {/* Botones de Acción */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setToastDeleteProp(false);
                }}
                className="w-full hover:cursor-pointer justify-center rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancelar
              </button>
              <button
                onClick={deleteProp}
                className="w-full hover:cursor-pointer justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition shadow-sm"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto w-full mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Contenedor Izquierdo: Textos */}
        <div>
          <h1 className="text-2xl font-bold text-slate-950 tracking-tight flex items-center gap-2">
            <span className="h-3 w-3 rounded-md bg-blue-600"></span>
            Editar una Propiedad
          </h1>
          <p className="text-sm text-slate-500 mt-1 ml-5">
            Edita los campos para editar la publicación en el sistema.
          </p>
        </div>

        {/* Contenedor Derecho: Botón de Volver */}
        <button
          onClick={() => navigate(-1)} // 👈 Regresa a la página anterior de forma nativa
          className="flex hover:cursor-pointer items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver
        </button>
      </div>

      <form
        onSubmit={actualizarPropiedad}
        className="max-w-7xl mx-auto p-8 bg-white border border-zinc-200 rounded-xl shadow-sm"
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="mb-8 pb-2 border-b border-zinc-100 flex flex-col gap-1">
              <span className="text-lg font-semibold text-zinc-900">
                Información de la Propiedad
              </span>
              <span className="text-sm font-normal text-zinc-500 lowercase first-letter:uppercase">
                Detalles básicos y ubicación del inmueble
              </span>
            </FieldLegend>

            <FieldGroup className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel className="text-zinc-700 font-medium">
                    Nombre de la Propiedad
                  </FieldLabel>
                  <Input
                    className="border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/5 transition-all"
                    id="titulo"
                    placeholder="Ej: Departamento en Palermo"
                    value={formData.titulo}
                    name="titulo"
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-zinc-700 font-medium">
                    Tipo de Propiedad
                  </FieldLabel>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "tipo", value } })
                    }
                  >
                    <SelectTrigger
                      className="border-zinc-200 bg-white"
                      id="tipo"
                    >
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {TIPO_LIST.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field>
                  <FieldLabel className="text-zinc-700 font-medium">
                    Calle
                  </FieldLabel>
                  <Input
                    className="border-zinc-200"
                    id="calle"
                    name="calle"
                    placeholder="Ej: Av. Santa Fe"
                    value={formData.calle}
                    onChange={handleChange}
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-zinc-700 font-medium">
                    Dirección
                  </FieldLabel>
                  <Input
                    className="border-zinc-200"
                    id="direccion"
                    name="direccion"
                    placeholder="Ej: 3526"
                    maxLength={4}
                    value={formData.direccion}
                    onChange={handleChange}
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-zinc-700 font-medium ">
                    Barrio
                  </FieldLabel>
                  <Select
                    value={formData.barrio}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "barrio", value } })
                    }
                  >
                    <SelectTrigger className="border-zinc-200 bg-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {BARRIOS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field>
                  <FieldLabel className="text-zinc-700 font-medium">
                    Habitaciones
                  </FieldLabel>
                  <Select
                    value={formData.habitaciones}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "habitaciones", value } })
                    }
                  >
                    <SelectTrigger className="border-zinc-200 bg-white">
                      <SelectValue placeholder="Cantidad de habitaciones" />
                    </SelectTrigger>
                    <SelectContent>
                      {OPCIONES_HABITACIONES.map((i) => (
                        <SelectItem key={i.value} value={i.value}>
                          {i.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel className="text-zinc-700 font-medium">
                    Baños
                  </FieldLabel>
                  <Select
                    value={formData.wc}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "wc", value } })
                    }
                  >
                    <SelectTrigger className="border-zinc-200 bg-white">
                      <SelectValue placeholder="Cantidad de baños" />
                    </SelectTrigger>
                    <SelectContent>
                      {OPCIONES_BANOS.map((i) => (
                        <SelectItem key={i.value} value={i.value}>
                          {i.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel className="text-zinc-700 font-medium">
                    Cochera
                  </FieldLabel>
                  <Select
                    value={formData.cochera}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "cochera", value } })
                    }
                  >
                    <SelectTrigger className="border-zinc-200 bg-white">
                      <SelectValue placeholder="Cuenta con cochera?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Si</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field>
                  <FieldLabel className="text-zinc-700 font-medium">
                    Precio
                  </FieldLabel>
                  <Input
                    className="border-zinc-200 font-semibold text-zinc-900"
                    placeholder="$ 0"
                    name="precio"
                    value={formatCurrencyAR(formData.precio)}
                    onChange={(e) => {
                      const rawValue = cleanNumericValue(e.target.value);
                      setFormData({
                        ...formData,
                        precio: rawValue,
                      });
                    }}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-zinc-700 font-medium">
                    Expensas
                  </FieldLabel>
                  <Input
                    className="border-zinc-200 font-semibold text-zinc-900"
                    placeholder="$ 0"
                    name="expensas"
                    value={formatCurrencyAR(formData.expensas)}
                    onChange={(e) => {
                      const rawValue = cleanNumericValue(e.target.value);
                      setFormData({
                        ...formData,
                        expensas: rawValue,
                      });
                    }}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-zinc-700 font-medium">
                    Tipo de Operacion
                  </FieldLabel>
                  <Select
                    value={formData.operacion}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "operacion", value } })
                    }
                  >
                    <SelectTrigger className="border-zinc-200 bg-white">
                      <SelectValue placeholder="Venta o Alquiler" />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERACION.map((i) => (
                        <SelectItem key={i.value} value={i.value}>
                          {i.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <Field>
            <FieldLabel className="text-zinc-900 font-semibold mb-4 block">
              Amenities Disponibles
            </FieldLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 border border-zinc-200 rounded-lg bg-zinc-50/50">
              {AMENITIES_LIST.map((amenity) => (
                <div key={amenity.value} className="flex items-center gap-3">
                  <Checkbox
                    id={amenity.value}
                    className="border border-black data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 hover:cursor-pointer"
                    // Comprobamos si el valor técnico (Parrilla, SUM, etc.) existe en el array
                    checked={formData.amenities?.includes(amenity.value)}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => {
                        const current = prev.amenities || [];
                        const next = checked
                          ? [...current, amenity.value]
                          : current.filter((val) => val !== amenity.value);

                        return { ...prev, amenities: next };
                      });
                    }}
                  />
                  <label
                    htmlFor={amenity.value}
                    className="text-sm font-medium text-zinc-600 cursor-pointer capitalize"
                  >
                    {amenity.label} {/* Aquí se verá: pileta, parrilla, etc. */}
                  </label>
                </div>
              ))}
            </div>
          </Field>

          <Field className="mt-8">
            <FieldLabel className="text-zinc-700 font-medium">
              Descripción Detallada
            </FieldLabel>
            <Textarea
              className="min-h-30 border-zinc-200 focus:ring-zinc-900/5 resize-none"
              placeholder="Describe las características principales..."
              value={formData.descripcion}
              onChange={handleChange}
              name="descripcion"
            />
          </Field>

          <Field className="mt-8">
            <FieldLabel className="text-zinc-700 font-medium mb-2">
              Galería de Fotos
            </FieldLabel>
            <div className="flex flex-wrap gap-3">
              {formData.imagenes.map((img, index) => (
                <div
                  key={index}
                  className="group relative h-40 w-auto overflow-hidden rounded-lg "
                >
                  {/* Imagen con transición suave */}
                  <img
                    className="h-50 w-60 aspect-video transition-transform duration-300 ease-in-out group-hover:scale-105"
                    src={img}
                    alt={`preview-${index}`}
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icono de Trash */}
                  <button
                    type="submit"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                   opacity-0 transform -translate-y-2.5
                   group-hover:opacity-100 group-hover:translate-y-0 
                   transition-all duration-300 hover:bg-red-600 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <label className="group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/30 hover:bg-white hover:border-zinc-400 transition-all cursor-pointer">
              <div className="flex flex-col items-center justify-center py-4">
                <svg
                  className="w-6 h-6 mb-2 text-zinc-400 group-hover:text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-sm text-zinc-600 font-medium">
                  Añadir imágenes
                </p>
                <p className="text-xs text-zinc-400">PNG, JPG hasta 10MB</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </Field>

          <div className="flex justify-between mt-12">
            <Button
              type="button"
              disabled={loading}
              onClick={() => {
                setToastDeleteProp(true);
              }}
              className="flex hover:cursor-pointer items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-semibold text-sm px-6 py-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              <Trash2 size={15} />
              Eliminar Propiedad
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="flex hover:cursor-pointer items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-6 rounded-xl shadow-sm shadow-blue-600/10 hover:shadow-md hover:shadow-blue-600/20 transition-all duration-200 active:scale-95"
            >
              <Edit3 size={15} />
              {loading ? "Editando..." : "Editar Propiedad"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </>
  );
};

export default EditProp;
