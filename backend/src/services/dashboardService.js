import { repositories } from "../repositories/index.js";
import { ahoraColombia, domingosHasta } from "../utils/fechas.js";

export class DashboardService {
  constructor(dependencias = repositories) { this.repositories = dependencias; }

  async summary(fecha = ahoraColombia().fecha) {
    const [antiguos, nuevos, asistencias, configuracion] = await Promise.all([
      this.repositories.members.listOld(), this.repositories.members.listNew(),
      this.repositories.attendance.list(), this.repositories.config.getAll(),
    ]);
    const hoy = asistencias.filter((item) => item.Fecha === fecha);
    const fechaAnterior = domingosHasta(fecha, 2)[1];
    const ultimoDomingo = asistencias.filter((item) => item.Fecha === fechaAnterior).length;
    const inicioMes = fecha.slice(0, 7);
    const nuevosMes = nuevos.filter((item) => String(item.FechaRegistro).startsWith(inicioMes)).length;
    const domingos = domingosHasta(fecha, Number(configuracion.DomingosInasistencia ?? 2));
    const cedulasConAsistencia = new Set(asistencias.filter((item) => domingos.includes(item.Fecha)).map((item) => item["Cédula"]));
    const inactivos = antiguos.filter((item) => !cedulasConAsistencia.has(item["Cédula"]));
    const porZona = Object.entries(hoy.reduce((acc, item) => ({ ...acc, [item.Zona || "Sin zona"]: (acc[item.Zona || "Sin zona"] ?? 0) + 1 }), {}))
      .map(([zona, total]) => ({ zona, total })).sort((a, b) => b.total - a.total).slice(0, 5);
    return {
      fecha, totalActivos: antiguos.length, asistentesHoy: hoy.length,
      variacionVsUltimoDomingo: ultimoDomingo ? Number((((hoy.length - ultimoDomingo) / ultimoDomingo) * 100).toFixed(1)) : null,
      nuevosMes, inactivos: inactivos.length, porZona,
      tablaInactivos: inactivos.slice(0, 100).map((item) => ({
        cedula: item["Cédula"], nombre: `${item.Nombres} ${item.Apellidos}`, zona: item.ZonaAtención,
        lider: item.LíderZonal,
        ultimaAsistencia: asistencias.filter((a) => a["Cédula"] === item["Cédula"]).sort((a, b) => b.Fecha.localeCompare(a.Fecha))[0]?.Fecha ?? "Sin registro",
      })),
    };
  }
}
