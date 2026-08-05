export const formatCurrencyAR = (value: string | number) => {
  if (value === undefined || value === null || value === "") return "";

  const stringValue = String(value).split(".")[0];

  const num = Number(stringValue.replace(/\D/g, ""));
  if (!num) return "";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(num);
};

export const cleanNumericValue = (value: string) => {
  return value.replace(/\D/g, "");
};
