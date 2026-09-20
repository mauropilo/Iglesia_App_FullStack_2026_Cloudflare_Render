import { ZodError } from "zod";

export function rutaNoEncontrada(req, res) {
  res.status(404).json({ error: { codigo: "RUTA_NO_ENCONTRADA", mensaje: `No existe ${req.method} ${req.originalUrl}.` } });
}

export function manejarError(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(422).json({ error: { codigo: "DATOS_INVALIDOS", mensaje: "Revisa los datos enviados.", detalles: error.issues } });
  }
  const estado = error.estado ?? 500;
  if (estado >= 500) console.error(error);
  return res.status(estado).json({ error: {
    codigo: error.codigo ?? "ERROR_INTERNO",
    mensaje: estado >= 500 ? "Ocurrió un error interno. Intenta nuevamente." : error.message,
    ...(error.detalles ? { detalles: error.detalles } : {}),
  } });
}
