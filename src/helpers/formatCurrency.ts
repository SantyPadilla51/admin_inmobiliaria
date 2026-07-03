// Convierte un número o string limpio en formato de moneda argentina: 150000 -> $ 150.000
export const formatCurrencyAR = (value: string | number) => {
  if (value === undefined || value === null || value === "") return "";

  // 1. Convertimos a string y nos quedamos SOLO con lo que esté antes del punto decimal
  // Esto transforma "650000.00" en "650000" inmediatamente
  const stringValue = String(value).split(".")[0];

  // 2. Ahora sí, eliminamos cualquier otro caracter que no sea número (por si acaso)
  const num = Number(stringValue.replace(/\D/g, ""));
  if (!num) return "";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0, // Fuerza a que no renderice centavos en el input
  }).format(num);
};

// Convierte el formato de moneda de vuelta a un número limpio para tu backend: "$ 150.000" -> "150000"
export const cleanNumericValue = (value: string) => {
  return value.replace(/\D/g, "");
};
