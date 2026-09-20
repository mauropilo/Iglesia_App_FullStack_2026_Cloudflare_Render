import { env } from "../config/env.js";
import { repositories } from "../repositories/index.js";
import { crearTextoReporte } from "../email/reportTemplate.js";
import { domingosHasta } from "../utils/fechas.js";
import { ErrorAplicacion } from "../utils/errors.js";

export async function enviarCorreoResend({ to, subject, text }, fetchImpl = fetch) {
  const respuesta = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.resendFrom, to: [to], subject, text }),
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new ErrorAplicacion("El proveedor de correo rechazó el envío.", 502, "ERROR_PROVEEDOR_CORREO", datos.message);
  }
  return datos;
}

export class ReportService {
  constructor(dependencias = repositories) { this.repositories = dependencias; }

  async preview(fecha, cantidadDomingos) {
    const [miembros, asistencias, lideres] = await Promise.all([
      this.repositories.members.listOld(), this.repositories.attendance.list(), this.repositories.leaders.list(),
    ]);
    const domingos = domingosHasta(fecha, cantidadDomingos);
    const reportes = lideres.map((lider) => {
      const zona = lider.ZonaAtención;
      const miembrosZona = miembros.filter((miembro) => miembro.ZonaAtención === zona);
      const pendientes = miembrosZona.filter((miembro) => !asistencias.some((asistencia) => asistencia["Cédula"] === miembro["Cédula"] && domingos.includes(asistencia.Fecha)))
        .map((miembro) => ({
          nombre: `${miembro.Nombres} ${miembro.Apellidos}`, cedula: miembro["Cédula"],
          telefono: miembro.Celular, correo: miembro.Correo,
          ultimaAsistencia: asistencias.filter((a) => a["Cédula"] === miembro["Cédula"]).sort((a, b) => b.Fecha.localeCompare(a.Fecha))[0]?.Fecha ?? "Sin registro",
        }));
      return {
        destinatario: lider.Mail, lider: lider.Nombre, zona,
        asunto: `Reporte de Inasistencia - ${zona} - ${fecha}`,
        total: pendientes.length,
        texto: crearTextoReporte({ lider: lider.Nombre, zona, fecha, cantidadDomingos, miembros: pendientes, iglesia: env.churchName }),
      };
    });
    return { fecha, cantidadDomingos, reportes };
  }

  async send(fecha, cantidadDomingos, confirmacion) {
    if (confirmacion !== "ENVIAR_REPORTES") throw new ErrorAplicacion("Se requiere confirmación explícita para enviar correos.", 400, "CONFIRMACION_REQUERIDA");
    if (!env.resendApiKey || !env.resendFrom) throw new ErrorAplicacion("El servicio de correo no está configurado.", 503, "CORREO_NO_CONFIGURADO");
    const vistaPrevia = await this.preview(fecha, cantidadDomingos);
    const resultados = [];
    for (const reporte of vistaPrevia.reportes) {
      const info = await enviarCorreoResend({ to: reporte.destinatario, subject: reporte.asunto, text: reporte.texto });
      resultados.push({ destinatario: reporte.destinatario, messageId: info.id });
    }
    return { fecha, enviados: resultados.length, resultados };
  }
}
