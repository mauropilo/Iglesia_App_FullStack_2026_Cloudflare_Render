import { verificarTokenGoogle } from "../config/firebase.js";
import { env } from "../config/env.js";
import { ErrorAplicacion } from "../utils/errors.js";

function rolPara(email) {
  const correo = email.toLowerCase();
  if (env.demoMode && correo === `admin@${env.allowedEmailDomain}`) return "administrador";
  if (env.adminEmails.includes(correo)) return "administrador";
  if (env.hostessEmails.includes(correo)) return "hostess";
  if (env.registroEmails.includes(correo)) return "registro";
  return null;
}

export async function autenticar(req, _res, next) {
  try {
    const encabezado = req.headers.authorization ?? "";
    const token = encabezado.startsWith("Bearer ") ? encabezado.slice(7) : "";
    if (!token) throw new ErrorAplicacion("Debes iniciar sesión.", 401, "TOKEN_AUSENTE");
    const identidad = await verificarTokenGoogle(token);
    const email = String(identidad.email ?? "").toLowerCase();
    const dominioPermitido = email.endsWith(`@${env.allowedEmailDomain}`);
    if (!dominioPermitido && !env.authorizedPersonalEmails.includes(email)) {
      throw new ErrorAplicacion("Esta cuenta no está autorizada.", 403, "CUENTA_NO_AUTORIZADA");
    }
    const rol = rolPara(email);
    if (!rol) throw new ErrorAplicacion("La cuenta no tiene un rol asignado.", 403, "ROL_NO_ASIGNADO");
    req.usuario = { uid: identidad.uid, email, nombre: identidad.name ?? email, rol };
    next();
  } catch (error) { next(error); }
}

export function autorizar(...roles) {
  return (req, _res, next) => req.usuario && roles.includes(req.usuario.rol)
    ? next()
    : next(new ErrorAplicacion("No tienes permiso para realizar esta acción.", 403, "PERMISO_DENEGADO"));
}
