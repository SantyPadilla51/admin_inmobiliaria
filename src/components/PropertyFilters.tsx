import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "../components/ui/select";
import { useSearchParams } from "react-router-dom";
import { Label } from "./ui/label";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

const PropertyFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const operacionSeleccionada = searchParams.get("operacion");
  const tipoSeleccionado = searchParams.get("tipo");
  const barrio = searchParams.get("barrio");

  const updateFilter = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const limpiarFiltros = () => {
    setSearchParams({});
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm/50 mb-8 items-end">
      {/* Operación */}
      <div className="space-y-2">
        <Label className="text-slate-500 font-medium text-xs tracking-wide">
          Operación
        </Label>
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 gap-1">
          {["alquiler", "venta"].map((op) => {
            const isActive = operacionSeleccionada === op;

            return (
              <button
                onClick={() => updateFilter("operacion", isActive ? null : op)}
                key={op}
                className={cn(
                  "flex-1 cursor-pointer py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize text-center",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/40"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50",
                )}
              >
                {op}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tipo de Propiedad */}
      <div className="space-y-2">
        <Label className="text-slate-500 font-medium text-xs tracking-wide">
          Tipo de Propiedad
        </Label>
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 gap-1">
          {["departamento", "PH", "casa"].map((tipo) => {
            const isActive = tipoSeleccionado === tipo;

            return (
              <button
                onClick={() => updateFilter("tipo", isActive ? null : tipo)}
                key={tipo}
                className={cn(
                  "flex-1 cursor-pointer py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize text-center",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/40"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50",
                )}
              >
                {tipo}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-2">
        <Label className="text-slate-500 font-medium text-xs tracking-wide">
          Ubicación
        </Label>
        <Select
          value={barrio}
          onValueChange={(val) => updateFilter("barrio", val)}
        >
          <SelectTrigger className="bg-slate-50 h-10 border border-slate-100 cursor-pointer rounded-xl text-slate-700 hover:bg-slate-100/70 focus:ring-0 focus:ring-offset-0 transition-colors text-sm font-medium shadow-none">
            <SelectValue placeholder="Seleccioná un barrio" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-slate-200 shadow-lg">
            <SelectGroup>
              <SelectLabel className="text-xs text-slate-400 font-normal px-2 py-1.5">
                Barrios más buscados
              </SelectLabel>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="almagro"
              >
                Almagro
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="recoleta"
              >
                Recoleta
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="belgrano"
              >
                Belgrano
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="puerto madero"
              >
                Puerto Madero
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="balvanera"
              >
                Balvanera
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="barracas"
              >
                Barracas
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="chacarita"
              >
                Chacarita
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="caballito"
              >
                Caballito
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="constitucion"
              >
                Constitucion
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="colegiales"
              >
                Colegiales
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="flores"
              >
                Flores
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="monserrat"
              >
                Monserrat
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="retiro"
              >
                Retiro
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="nuñez"
              >
                Nuñez
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="parque chacabuco"
              >
                Parque Chacabuco
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="saavedra"
              >
                Saavedra
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="san telmo"
              >
                San Telmo
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="villa crespo"
              >
                Villa Crespo
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="villa devoto"
              >
                Villa Devoto
              </SelectItem>
              <SelectItem
                className="rounded-lg cursor-pointer text-sm"
                value="villa urquiza"
              >
                Villa Urquiza
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Botón de Limpiar Filtros - Ubicado discretamente debajo */}
      <div className="md:col-span-3 flex justify-end pt-2">
        <Button
          variant="link"
          className="text-slate-400 text-xs font-medium w-fit p-0 h-auto hover:text-red-500 transition-colors cursor-pointer"
          onClick={limpiarFiltros}
        >
          Borrar todos los filtros
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
