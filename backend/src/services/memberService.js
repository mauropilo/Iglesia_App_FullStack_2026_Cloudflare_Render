import { esquemaMiembroNuevo } from "../models/schemas.js";
import { repositories } from "../repositories/index.js";
import { calcularEdad, ahoraColombia } from "../utils/fechas.js";
import { ErrorAplicacion } from "../utils/errors.js";

export class MemberService {
  constructor(dependencias = repositories) { this.repositories = dependencias; }

  async createNew(datos) {
    const validado = esquemaMiembroNuevo.parse({ ...datos, edad: datos.edad == null ? undefined : Number(datos.edad) });
    const existe = await this.repositories.members.findOldById(validado.cedula) ?? await this.repositories.members.findNewById(validado.cedula);
    if (existe) throw new ErrorAplicacion("La persona ya está registrada.", 409, "MIEMBRO_DUPLICADO");
    const miembro = { ...validado, edad: calcularEdad(validado.fechaNacimiento), fechaRegistro: ahoraColombia().fecha };
    await this.repositories.members.createNew(miembro);
    return miembro;
  }

  async listNew() { return this.repositories.members.listNew(); }

  async moveToOld(cedula, nombreLider) {
    const miembro = await this.repositories.members.findNewById(cedula);
    if (!miembro) throw new ErrorAplicacion("No se encontró el miembro nuevo.", 404, "MIEMBRO_NO_ENCONTRADO");
    const lider = await this.repositories.leaders.findByName(nombreLider);
    if (!lider) throw new ErrorAplicacion("No se encontró el líder seleccionado.", 404, "LIDER_NO_ENCONTRADO");
    return this.repositories.members.moveToOld(miembro, lider);
  }

  async updatePhoto(cedula, fotoUrl) {
    let miembro = await this.repositories.members.findOldById(cedula);
    let tabla = "Antiguos";
    if (!miembro) { miembro = await this.repositories.members.findNewById(cedula); tabla = "Nuevos"; }
    if (!miembro) throw new ErrorAplicacion("No se encontró el miembro.", 404, "MIEMBRO_NO_ENCONTRADO");
    return this.repositories.members.updatePhoto(tabla, miembro.__fila, fotoUrl);
  }
}
