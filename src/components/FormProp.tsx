import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Controller, useForm } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { AMENITIES_LIST, BARRIOS, OPCIONES_BANOS, OPCIONES_HABITACIONES, TIPO_LIST } from "../constants/propiedades";
import { FieldError } from "../components/ui/field";
import { useState, type ChangeEvent } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProp } from "@/services/props/createProp";
import { formSchema } from "@/schemas/formProp.schema";
import { Toaster } from "react-hot-toast";

type FormPropsData = z.infer<typeof formSchema>;

interface ImageFile {
  file: File;
  preview: string;
}

const FormProp = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const form = useForm<FormPropsData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      tipo: "",
      calle: "",
      direccion: "",
      barrio: "",
      habitaciones: "",
      wc: "",
      cochera: "",
      precio: "",
      expensas: "",
      amenities: [],
      descripcion: "",
    },
  });

  const { control, handleSubmit, setValue, watch } = form;

  const currentAmenities: string[] = watch("amenities") || [];
  const currentDescripcion: string = watch("descripcion") || "";

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    const formatted = new Intl.NumberFormat("de-DE").format(parseInt(digits, 10));
    return `$${formatted}`;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages: ImageFile[] = filesArray.map((file) => ({
        file: file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
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

  const onSubmitForm = async (data: FormPropsData) => {
    createProp(data, images, setLoading);
  };

  return (
    <>
      <Toaster />
      <div className=" max-w-7xl mx-auto mb-8 px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 tracking-tight flex items-center gap-2">
              <span className="h-3 w-3 rounded-md bg-blue-600"></span>
              Agrega una nueva Propiedad
            </h1>
            <p className="text-sm text-slate-500 mt-1 ml-5">
              Completa los campos para crear una nueva publicación en el sistema.
            </p>
          </div>
        </div>

        {/* Formulario conectado al interceptor de validación de RHF */}
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="p-8 bg-white border border-zinc-200 rounded-xl shadow-sm"
        >
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="mb-8 pb-2 border-b border-zinc-100 flex flex-col gap-1">
                <span className="text-lg font-semibold text-zinc-900">Información de la Propiedad</span>
                <span className="text-sm font-normal text-zinc-500 uppercase first-letter:uppercase">
                  Detalles básicos y ubicación del inmueble
                </span>
              </FieldLegend>

              <FieldGroup className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 1. TITULO */}
                  <Controller
                    name="titulo"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Título de la publicación</FieldLabel>
                        <Input
                          {...field}
                          placeholder="Escribí un título llamativo"
                          aria-invalid={fieldState.invalid}
                          className="bg-white!"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* 2. TIPO DE PROPIEDAD */}
                  <Controller
                    name="tipo"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-zinc-700 font-medium">Tipo de Propiedad</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            className={`bg-white transition-colors ${
                              fieldState.invalid
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-zinc-200"
                            }`}
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
                        {fieldState.invalid && <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>}
                      </Field>
                    )}
                  />
                </div>

                {/* 3. CALLE Y DIRECCION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Controller
                    name="calle"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-zinc-700 font-medium">Calle</FieldLabel>
                        <Input
                          {...field}
                          placeholder="Ej: Av. Santa Fe"
                          className={fieldState.invalid ? "border-red-500 focus:ring-red-500" : "border-zinc-200"}
                        />
                        {fieldState.invalid && <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>}
                      </Field>
                    )}
                  />

                  <Controller
                    name="direccion"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-zinc-700 font-medium">Dirección (Altura)</FieldLabel>
                        <Input
                          {...field}
                          placeholder="Ej: 3526"
                          maxLength={5}
                          className={fieldState.invalid ? "border-red-500 focus:ring-red-500" : "border-zinc-200"}
                        />
                        {fieldState.invalid && <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>}
                      </Field>
                    )}
                  />

                  <Controller
                    name="barrio"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-zinc-700 font-medium">Barrio</FieldLabel>

                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            className={`bg-white transition-colors ${
                              fieldState.invalid
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-zinc-200"
                            }`}
                          >
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

                        {fieldState.invalid && <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>}
                      </Field>
                    )}
                  />
                </div>

                {/* 4. INTERIORES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Controller
                    name="habitaciones"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-zinc-700 font-medium">Habitaciones</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            className={`bg-white transition-colors ${
                              fieldState.invalid
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-zinc-200"
                            }`}
                          >
                            <SelectValue placeholder="Habitaciones" />
                          </SelectTrigger>
                          <SelectContent>
                            {OPCIONES_HABITACIONES.map((i) => (
                              <SelectItem key={i.value} value={i.value}>
                                {i.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>}
                      </Field>
                    )}
                  />

                  <Controller
                    name="wc"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-zinc-700 font-medium">Baños</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            className={`bg-white transition-colors ${
                              fieldState.invalid
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-zinc-200"
                            }`}
                          >
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
                        {fieldState.invalid && <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>}
                      </Field>
                    )}
                  />

                  <Controller
                    name="cochera"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-zinc-700 font-medium">Cochera</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            className={`bg-white transition-colors ${
                              fieldState.invalid
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-zinc-200"
                            }`}
                          >
                            <SelectValue placeholder="¿Tiene cochera?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="si">Si</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>}
                      </Field>
                    )}
                  />
                </div>

                {/* 5. PRECIOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="precio"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-zinc-700 font-medium">Precio</FieldLabel>
                        <Input
                          className={`bg-white transition-colors ${
                            fieldState.invalid
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-zinc-200"
                          }`}
                          placeholder="$ 0"
                          value={field.value}
                          onChange={(e) => setValue("precio", formatCurrency(e.target.value))}
                        />
                        {fieldState.invalid && <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>}
                      </Field>
                    )}
                  />

                  <Controller
                    name="expensas"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-zinc-700 font-medium">Expensas</FieldLabel>
                        <Input
                          className={`bg-white transition-colors ${
                            fieldState.invalid
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-zinc-200"
                          }`}
                          placeholder="$ 0"
                          value={field.value}
                          onChange={(e) => setValue("expensas", formatCurrency(e.target.value))}
                        />
                        {fieldState.invalid && <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>}
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </FieldSet>

            {/* AMENITIES */}
            <Field className="mt-8">
              <FieldLabel className="text-zinc-900 font-semibold mb-4 block">Amenities Disponibles</FieldLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 border border-zinc-200 rounded-lg bg-zinc-50/50">
                {AMENITIES_LIST.map((amenity) => (
                  <div key={amenity.value} className="flex items-center gap-3">
                    <Checkbox
                      id={amenity.value}
                      className="border border-black data-[state=checked]:bg-zinc-900 hover:cursor-pointer"
                      checked={currentAmenities.includes(amenity.value)}
                      onCheckedChange={(checked) => {
                        const next = checked
                          ? [...currentAmenities, amenity.value]
                          : currentAmenities.filter((id) => id !== amenity.value);
                        setValue("amenities", next);
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

            {/* DESCRIPCION */}
            <Field className="mt-8">
              <FieldLabel className="text-zinc-700 font-medium">Descripción Detallada</FieldLabel>
              <Textarea
                className="min-h-30 border-zinc-200 resize-none"
                placeholder="Describe las características principales..."
                value={currentDescripcion}
                onChange={(e) => setValue("descripcion", e.target.value)}
              />
            </Field>

            {/* IMÁGENES */}
            <Field className="mt-8">
              <FieldLabel className="text-zinc-700 font-medium mb-2">Galería de Fotos</FieldLabel>
              <div className="flex flex-wrap gap-3 mb-3">
                {images.map((img, idx) => (
                  <div key={idx} className="group relative h-40 w-40 overflow-hidden rounded-lg border border-zinc-200">
                    <img className="h-full w-full object-cover" src={img.preview} alt="preview" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <label className="group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/30 hover:bg-white hover:border-zinc-400 transition-all cursor-pointer">
                <div className="flex flex-col items-center justify-center py-4">
                  <p className="text-sm text-zinc-600 font-medium">Añadir imágenes</p>
                  <p className="text-xs text-zinc-400">PNG, JPG hasta 10MB</p>
                </div>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </Field>

            {/* BOTÓN SUBMIT */}
            <div className="flex justify-end mt-12">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer"
              >
                {loading ? "Publicando..." : "Publicar Propiedad"}
              </button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </>
  );
};

export default FormProp;
