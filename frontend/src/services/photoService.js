async function comprimirImagen(blob, maxBytes = 500_000) {
  const bitmap = await createImageBitmap(blob);
  const escala = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala); canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  for (const calidad of [0.82, 0.72, 0.62, 0.52]) {
    const salida = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", calidad));
    if (salida.size <= maxBytes) return salida;
  }
  throw new Error("La foto supera 500 KB después de comprimirla.");
}

export async function subirFoto(cedula, blob, firmarFoto) {
  const comprimida = await comprimirImagen(blob);
  const firma = await firmarFoto(cedula);
  const formulario = new FormData();
  formulario.append("file", comprimida, `${cedula}.jpg`);
  formulario.append("api_key", firma.apiKey);
  formulario.append("timestamp", String(firma.timestamp));
  formulario.append("signature", firma.signature);
  formulario.append("folder", firma.folder);
  formulario.append("public_id", firma.public_id);

  const respuesta = await fetch(`https://api.cloudinary.com/v1_1/${firma.cloudName}/image/upload`, {
    method: "POST",
    body: formulario,
  });
  const datos = await respuesta.json();
  if (!respuesta.ok || !datos.secure_url) throw new Error(datos.error?.message ?? "No fue posible subir la fotografía.");
  return datos.secure_url;
}
