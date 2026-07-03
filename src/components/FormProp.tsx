import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useState, type ChangeEvent } from "react";
import { Checkbox } from "../components/ui/checkbox";
import { PropiedadModelo, type Propiedad } from "../interfaces/Propiedad";
import toast from "react-hot-toast";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AMENITIES_LIST,
  BARRIOS,
  OPCIONES_BANOS,
  OPCIONES_HABITACIONES,
  OPERACION,
  TIPO_LIST,
} from "../constants/propiedades";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FormProp = () => {
  const [form, setForm] = useState<Propiedad>(new PropiedadModelo());
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  interface ImageFile {
    file: File;
    preview: string;
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      const newImages: ImageFile[] = filesArray.map((file) => ({
        file: file,
        preview: URL.createObjectURL(file),
      }));

      const stringImages = filesArray.map((file) => file.name);

      setImages((prev) => [...prev, ...newImages]);

      setForm((prevForm) => ({
        ...prevForm,
        imagenes: [...(prevForm.imagenes || []), ...stringImages],
      }));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const camposAValidar = (
      Object.keys(form) as Array<keyof typeof form>
    ).filter((campo) => campo !== "amenities" && campo !== "imagenes");

    const tieneCamposVacios = camposAValidar.some((campo) => {
      const valor = form[campo];

      return (valor ?? "").toString().trim() === "";
    });

    if (tieneCamposVacios) {
      toast.error("Por favor, completa todos los campos obligatorios.", {
        position: "top-right",
        style: { background: "#E61717", color: "white" },
        iconTheme: {
          primary: "#E61717",
          secondary: "#ffff",
        },
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      const precioLimpio = parseInt(form.precio.replace(/[^0-9]/g, ""), 10);
      const expensasLimpias = parseInt(
        form.expensas.replace(/[^0-9]/g, ""),
        10,
      );

      formData.append("titulo", form.titulo);
      formData.append("barrio", form.barrio);
      formData.append("habitaciones", form.habitaciones);
      formData.append("wc", form.wc);
      formData.append("descripcion", form.descripcion);
      formData.append("operacion", form.operacion);
      formData.append("calle", form.calle.trim());
      formData.append("cochera", form.cochera);
      formData.append("tipo", form.tipo);
      formData.append("direccion", Number(form.direccion).toString());
      formData.append("amenities", JSON.stringify(form.amenities));
      formData.append("precio", precioLimpio.toString());
      formData.append("expensas", expensasLimpias.toString());

      // Agregamos las imágenes reales del estado 'images'
      images.forEach((imgObj) => {
        formData.append("imagenes", imgObj.file);
      });

      const response = await fetch(
        "https://backend-inmobiliaria-argenta.vercel.app/propiedades",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (result.ok === true) {
        toast.success(result.msg, {
          position: "top-right",
          duration: 1500,
        });
        window.location.href = "/admin/dashboard";
      } else {
        toast.error(result.msg, {
          position: "top-right",
          duration: 1500,
        });
      }
    } catch (error) {
      return;
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: any) => {
    const digits = value.replace(/\D/g, "");

    if (!digits) return "";

    const formatted = new Intl.NumberFormat("de-DE").format(digits);

    return `$${formatted}`;
  };

  return (
    <>
      <>
        <div className="max-w-7xl mx-auto w-full mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Contenedor Izquierdo: Textos */}
          <div>
            <h1 className="text-2xl font-bold text-slate-950 tracking-tight flex items-center gap-2">
              <span className="h-3 w-3 rounded-md bg-blue-600"></span>
              Agrega una nueva Propiedad
            </h1>
            <p className="text-sm text-slate-500 mt-1 ml-5">
              Completa los campos para crear una nueva publicación en el
              sistema.
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

        <form className="max-w-7xl mx-auto p-8 bg-white border border-zinc-200 rounded-xl shadow-sm">
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
                      onChange={(e) =>
                        setForm({ ...form, titulo: e.target.value })
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-zinc-700 font-medium">
                      Tipo de Propiedad
                    </FieldLabel>
                    <Select
                      value={form.tipo}
                      onValueChange={(value) =>
                        setForm({ ...form, tipo: value ?? "" })
                      }
                    >
                      <SelectTrigger
                        className="border-zinc-200 bg-white"
                        id="tipo-propiedad"
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
                      id="calle-propiedad"
                      placeholder="Ej: Av. Santa Fe"
                      onChange={(e) =>
                        setForm({ ...form, calle: e.target.value })
                      }
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-zinc-700 font-medium">
                      Dirección
                    </FieldLabel>
                    <Input
                      className="border-zinc-200"
                      id="direccion-propiedad"
                      placeholder="Ej: 3526"
                      maxLength={4}
                      onChange={(e) =>
                        setForm({ ...form, direccion: e.target.value })
                      }
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-zinc-700 font-medium ">
                      Barrio
                    </FieldLabel>
                    <Select
                      value={form.barrio}
                      onValueChange={(value) =>
                        setForm({ ...form, barrio: value ?? "" })
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
                      value={form.habitaciones}
                      onValueChange={(v) =>
                        setForm({ ...form, habitaciones: v ?? "" })
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
                      value={form.wc}
                      onValueChange={(v) => setForm({ ...form, wc: v ?? "" })}
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
                      value={form.cochera}
                      onValueChange={(v) =>
                        setForm({ ...form, cochera: v ?? "" })
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
                      value={form.precio || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          precio: formatCurrency(e.target.value),
                        })
                      }
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-zinc-700 font-medium">
                      Expensas
                    </FieldLabel>
                    <Input
                      className="border-zinc-200 font-semibold text-zinc-900"
                      placeholder="$ 0"
                      value={form.expensas || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          expensas: formatCurrency(e.target.value),
                        })
                      }
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-zinc-700 font-medium">
                      Operacion
                    </FieldLabel>
                    <Select
                      value={form.operacion}
                      onValueChange={(v) =>
                        setForm({ ...form, operacion: v ?? "" })
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
                      checked={form.amenities?.includes(amenity.value)}
                      onCheckedChange={(checked) => {
                        const current = form.amenities || [];
                        const next = checked
                          ? [...current, amenity.value]
                          : current.filter((id) => id !== amenity.value);
                        setForm({ ...form, amenities: next });
                      }}
                    />
                    <label
                      htmlFor={amenity.value}
                      className="capitalize text-sm font-medium text-zinc-600 cursor-pointer"
                    >
                      {amenity.value}
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
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />
            </Field>

            <Field className="mt-8">
              <FieldLabel className="text-zinc-700 font-medium mb-2">
                Galería de Fotos
              </FieldLabel>
              <div className="flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="group relative h-40 w-auto overflow-hidden rounded-lg "
                  >
                    <img
                      className="h-50 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      src={img.preview}
                      alt={`preview-${index}`}
                    />

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <button
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

            <div className="flex justify-end mt-12">
              {!loading ? (
                <Button
                  type="submit"
                  className="flex items-center hover:cursor-pointer gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-6 rounded-xl shadow-sm shadow-blue-600/10 hover:shadow-md hover:shadow-blue-600/20 transition-all duration-200 active:scale-95"
                  onClick={handleSubmit}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p>Publicar Propiedad</p>
                </Button>
              ) : (
                <Button
                  disabled
                  className="flex items-center hover:cursor-pointer gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-6 rounded-xl shadow-sm shadow-blue-600/10 hover:shadow-md hover:shadow-blue-600/20 transition-all duration-200 active:scale-95"
                >
                  <p>Publicando...</p>
                </Button>
              )}
            </div>
          </FieldGroup>
        </form>
      </>
    </>
  );
};

export default FormProp;
