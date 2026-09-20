import { env } from "../config/env.js";
import { obtenerSheets } from "../config/googleSheets.js";
import { ErrorAplicacion } from "../utils/errors.js";
import { colaEscrituras } from "../utils/writeQueue.js";

const escaparHoja = (nombre) => `'${nombre.replaceAll("'", "''")}'`;

function filaAObjeto(encabezados, fila = []) {
  return Object.fromEntries(encabezados.map((encabezado, indice) => [encabezado, fila[indice] ?? ""]));
}

function valorSeguro(valor) {
  if (typeof valor !== "string") return valor;
  return /^[=+\-@]/.test(valor) ? `'${valor}` : valor;
}

export class SheetsStore {
  async leer(nombreHoja) {
    const sheets = await obtenerSheets();
    const respuesta = await sheets.spreadsheets.values.get({
      spreadsheetId: env.googleSheetId,
      range: `${escaparHoja(nombreHoja)}!A:AZ`,
    });
    const [encabezados = [], ...filas] = respuesta.data.values ?? [];
    return filas.map((fila, indice) => ({ ...filaAObjeto(encabezados, fila), __fila: indice + 2 }));
  }

  async buscar(nombreHoja, campo, valor) {
    const filas = await this.leer(nombreHoja);
    return filas.find((fila) => String(fila[campo]).trim() === String(valor).trim()) ?? null;
  }

  async agregar(nombreHoja, registro) {
    return colaEscrituras.add(async () => {
      const sheets = await obtenerSheets();
      const encabezados = await this.#encabezados(nombreHoja);
      const valores = encabezados.map((encabezado) => valorSeguro(registro[encabezado] ?? ""));
      await sheets.spreadsheets.values.append({
        spreadsheetId: env.googleSheetId,
        range: `${escaparHoja(nombreHoja)}!A:AZ`,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [valores] },
      });
      return registro;
    });
  }

  async actualizar(nombreHoja, numeroFila, cambios) {
    return colaEscrituras.add(async () => {
      const sheets = await obtenerSheets();
      const encabezados = await this.#encabezados(nombreHoja);
      const actual = (await this.leer(nombreHoja)).find((fila) => fila.__fila === numeroFila);
      if (!actual) throw new ErrorAplicacion("El registro ya no existe.", 404, "REGISTRO_NO_ENCONTRADO");
      const final = { ...actual, ...cambios };
      await sheets.spreadsheets.values.update({
        spreadsheetId: env.googleSheetId,
        range: `${escaparHoja(nombreHoja)}!A${numeroFila}:${this.#columna(encabezados.length)}${numeroFila}`,
        valueInputOption: "RAW",
        requestBody: { values: [encabezados.map((encabezado) => valorSeguro(final[encabezado] ?? ""))] },
      });
      return final;
    });
  }

  async eliminar(nombreHoja, numeroFila) {
    return colaEscrituras.add(async () => {
      const sheets = await obtenerSheets();
      const meta = await sheets.spreadsheets.get({ spreadsheetId: env.googleSheetId, fields: "sheets.properties" });
      const hoja = meta.data.sheets.find((item) => item.properties.title === nombreHoja);
      if (!hoja) throw new ErrorAplicacion(`No existe la hoja ${nombreHoja}.`, 500, "HOJA_NO_ENCONTRADA");
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: env.googleSheetId,
        requestBody: { requests: [{ deleteDimension: { range: { sheetId: hoja.properties.sheetId, dimension: "ROWS", startIndex: numeroFila - 1, endIndex: numeroFila } } }] },
      });
    });
  }

  async #encabezados(nombreHoja) {
    const sheets = await obtenerSheets();
    const respuesta = await sheets.spreadsheets.values.get({ spreadsheetId: env.googleSheetId, range: `${escaparHoja(nombreHoja)}!1:1` });
    const encabezados = respuesta.data.values?.[0] ?? [];
    if (!encabezados.length) throw new ErrorAplicacion(`La hoja ${nombreHoja} no tiene encabezados.`, 500, "HOJA_SIN_ENCABEZADOS");
    return encabezados;
  }

  #columna(numero) {
    let resultado = "";
    while (numero > 0) { numero--; resultado = String.fromCharCode(65 + (numero % 26)) + resultado; numero = Math.floor(numero / 26); }
    return resultado;
  }
}
