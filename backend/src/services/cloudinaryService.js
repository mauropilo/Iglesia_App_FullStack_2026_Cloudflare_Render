import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { env } from "../config/env.js";
import { ErrorAplicacion } from "../utils/errors.js";

const esquemaCedula = z.string().regex(/^\d{6,12}$/);

export function firmarParametrosCloudinary(parametros, secreto) {
  const cadena = Object.entries(parametros)
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([clave, valor]) => `${clave}=${valor}`)
    .join("&");
  return createHash("sha256").update(`${cadena}${secreto}`).digest("hex");
}

export function crearFirmaFoto(cedula) {
  const identificacion = esquemaCedula.parse(String(cedula ?? ""));
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new ErrorAplicacion("El almacenamiento de fotografías no está configurado.", 503, "FOTOS_NO_CONFIGURADAS");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `iglesia/miembros/${identificacion}`;
  const publicId = randomUUID();
  const parametros = { folder, public_id: publicId, timestamp };

  return {
    cloudName: env.cloudinaryCloudName,
    apiKey: env.cloudinaryApiKey,
    signature: firmarParametrosCloudinary(parametros, env.cloudinaryApiSecret),
    ...parametros,
  };
}
