import { repositories } from "../repositories/index.js";
import { ahoraColombia } from "../utils/fechas.js";
import { conBloqueo } from "../utils/keyedLock.js";
import { parsearEscaneo } from "../utils/scanParser.js";

const nombreCompleto = (miembro) => `${miembro.Nombres} ${miembro.Apellidos}`.trim();

export class AttendanceService {
  constructor(dependencias = repositories) { this.repositories = dependencias; }

  async scan(entrada) {
    const documento = parsearEscaneo(entrada);
    const antiguo = await this.repositories.members.findOldById(documento.cedula);
    const nuevo = antiguo ? null : await this.repositories.members.findNewById(documento.cedula);
    const miembro = antiguo ?? nuevo;

    if (!miembro) return { estado: "REQUIERE_REGISTRO", datosDocumento: documento };

    const { fecha, hora } = ahoraColombia();
    return conBloqueo(`${documento.cedula}:${fecha}`, async () => {
      const existente = await this.repositories.attendance.findToday(documento.cedula, fecha);
      if (existente) {
        return { estado: "YA_REGISTRADO", nombre: nombreCompleto(miembro), fecha, hora: existente.Hora };
      }
      await this.repositories.attendance.create({
        cedula: documento.cedula, fecha, hora, zona: miembro.ZonaAtención,
      });
      return {
        estado: "REGISTRADO",
        tipoMiembro: antiguo ? "ANTIGUO" : "NUEVO",
        nombre: nombreCompleto(miembro),
        fecha, hora,
        zona: miembro.ZonaAtención || "Pendiente",
        lider: miembro.LíderZonal || "Pendiente de asignación",
        fotoUrl: miembro["Foto (URL)"] || "",
      };
    });
  }
}
