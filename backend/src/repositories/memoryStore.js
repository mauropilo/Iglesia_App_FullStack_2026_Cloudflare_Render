const tablas = {
  Antiguos: [{
    "Cédula": "1012345678", Nombres: "Sofía Elena", Apellidos: "Rojas Pérez", Celular: "3001112233",
    Edad: "34", FechaNac: "1992-06-18", Sexo: "F", Etapa: "Consolidación", LugarNac: "Bogotá",
    Dirección: "Dato protegido", Correo: "sofia@example.com", Estado: "Activo", FechaSalvación: "2024-05-12",
    Localidad: "Suba", ReuniónZonal: "Norte 1", LíderZonal: "Daniel Rojas", ZonaAtención: "Norte", "Foto (URL)": "",
  }],
  Nuevos: [],
  Asistencia: [{ "Cédula": "1098765432", Fecha: new Date().toISOString().slice(0, 10), Hora: "09:18:42", Zona: "Centro" }],
  Líderes: [
    { Nombre: "Daniel Rojas", ZonaAtención: "Norte", Localidad: "Suba", Mail: "daniel@example.com", Teléfono: "3001002000" },
    { Nombre: "Ana Torres", ZonaAtención: "Centro", Localidad: "Teusaquillo", Mail: "ana@example.com", Teléfono: "3001003000" },
  ],
  Configuración: [
    { Parámetro: "DomingosInasistencia", Valor: "2" },
    { Parámetro: "HoraEnvioReporte", Valor: "09:00" },
  ],
};

export class MemoryStore {
  async leer(nombreHoja) { return structuredClone((tablas[nombreHoja] ?? []).map((fila, indice) => ({ ...fila, __fila: indice + 2 }))); }
  async buscar(nombreHoja, campo, valor) { return (await this.leer(nombreHoja)).find((fila) => String(fila[campo]) === String(valor)) ?? null; }
  async agregar(nombreHoja, registro) { tablas[nombreHoja] ??= []; tablas[nombreHoja].push(structuredClone(registro)); return registro; }
  async actualizar(nombreHoja, numeroFila, cambios) { const indice = numeroFila - 2; tablas[nombreHoja][indice] = { ...tablas[nombreHoja][indice], ...cambios }; return { ...tablas[nombreHoja][indice], __fila: numeroFila }; }
  async eliminar(nombreHoja, numeroFila) { tablas[nombreHoja].splice(numeroFila - 2, 1); }
}
