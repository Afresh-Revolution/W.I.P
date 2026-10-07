const rasterExtensions = new Set(["jpg", "jpeg", "png", "webp", "gif", "bmp", "tif", "tiff", "heic", "heif", "avif", "jfif", "pjpeg", "pjp"]);

export function isRasterImage(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  if (file.type === "image/svg+xml" || extension === "svg") return false;
  if (file.type.startsWith("image/")) return true;
  return rasterExtensions.has(extension);
}
