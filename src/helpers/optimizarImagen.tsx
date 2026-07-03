export const optimizarImagen = (
  url: string | undefined | null,
): string | null => {
  if (!url || typeof url !== "string") {
    return null;
  }

  if (!url.includes("cloudinary.com")) return url;

  return url.replace("/upload/", "/upload/f_auto,q_auto,w_800/");
};
