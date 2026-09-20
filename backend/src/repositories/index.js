import { env } from "../config/env.js";
import { MemoryStore } from "./memoryStore.js";
import { SheetsStore } from "./sheetsStore.js";

const store = env.demoMode ? new MemoryStore() : new SheetsStore();

export class MemberRepository {
  async findOldById(cedula) { return store.buscar("Antiguos", "Cédula", cedula); }
  async findNewById(cedula) { return store.buscar("Nuevos", "Cédula", cedula); }
  async listOld() { return store.leer("Antiguos"); }
  async listNew() { return store.leer("Nuevos"); }
  async createNew(miembro) { return store.agregar("Nuevos", this.#toRow(miembro, true)); }
  async updatePhoto(tabla, fila, fotoUrl) { return store.actualizar(tabla, fila, { "Foto (URL)": fotoUrl }); }
  async moveToOld(miembro, lider) {
    const filaAntiguo = { ...miembro, LíderZonal: lider.Nombre, ZonaAtención: lider.ZonaAtención };
    delete filaAntiguo.FechaRegistro; delete filaAntiguo.__fila;
    await store.agregar("Antiguos", filaAntiguo);
    await store.eliminar("Nuevos", miembro.__fila);
    return filaAntiguo;
  }
  #toRow(miembro, nuevo) {
    return {
      "Cédula": miembro.cedula, Nombres: miembro.nombres, Apellidos: miembro.apellidos, Celular: miembro.celular,
      Edad: miembro.edad, FechaNac: miembro.fechaNacimiento, Sexo: miembro.sexo, Etapa: miembro.etapa,
      LugarNac: miembro.lugarNacimiento, Dirección: miembro.direccion, Correo: miembro.correo, Estado: miembro.estado,
      FechaSalvación: miembro.fechaSalvacion, Localidad: miembro.localidad, ReuniónZonal: miembro.reunionZonal,
      LíderZonal: miembro.liderZonal, ZonaAtención: miembro.zonaAtencion, "Foto (URL)": miembro.fotoUrl,
      ...(nuevo ? { FechaRegistro: miembro.fechaRegistro } : {}),
    };
  }
}

export class AttendanceRepository {
  async findToday(cedula, fecha) { return (await store.leer("Asistencia")).find((fila) => fila["Cédula"] === cedula && fila.Fecha === fecha) ?? null; }
  async create({ cedula, fecha, hora, zona }) { return store.agregar("Asistencia", { "Cédula": cedula, Fecha: fecha, Hora: hora, Zona: zona ?? "" }); }
  async list() { return store.leer("Asistencia"); }
}

export class LeaderRepository {
  async list() { return store.leer("Líderes"); }
  async findByName(nombre) { return store.buscar("Líderes", "Nombre", nombre); }
  async create(lider) { return store.agregar("Líderes", { Nombre: lider.nombre, ZonaAtención: lider.zonaAtencion, Localidad: lider.localidad, Mail: lider.mail, Teléfono: lider.telefono }); }
  async update(fila, lider) { return store.actualizar("Líderes", fila, { Nombre: lider.nombre, ZonaAtención: lider.zonaAtencion, Localidad: lider.localidad, Mail: lider.mail, Teléfono: lider.telefono }); }
  async remove(fila) { return store.eliminar("Líderes", fila); }
}

export class ConfigRepository {
  async getAll() {
    const filas = await store.leer("Configuración");
    return Object.fromEntries(filas.map((fila) => [fila.Parámetro, fila.Valor]));
  }
  async set(nombre, valor) {
    const actual = await store.buscar("Configuración", "Parámetro", nombre);
    return actual ? store.actualizar("Configuración", actual.__fila, { Valor: String(valor) }) : store.agregar("Configuración", { Parámetro: nombre, Valor: String(valor) });
  }
}

export const repositories = {
  members: new MemberRepository(),
  attendance: new AttendanceRepository(),
  leaders: new LeaderRepository(),
  config: new ConfigRepository(),
};
