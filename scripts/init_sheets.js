#!/usr/bin/env node
import "dotenv/config";
import { google } from "googleapis";

const hojas = {
  Antiguos: ["Cédula", "Nombres", "Apellidos", "Celular", "Edad", "FechaNac", "Sexo", "Etapa", "LugarNac", "Dirección", "Correo", "Estado", "FechaSalvación", "Localidad", "ReuniónZonal", "LíderZonal", "ZonaAtención", "Foto (URL)"],
  Nuevos: ["Cédula", "Nombres", "Apellidos", "Celular", "Edad", "FechaNac", "Sexo", "Etapa", "LugarNac", "Dirección", "Correo", "Estado", "FechaSalvación", "Localidad", "ReuniónZonal", "LíderZonal", "ZonaAtención", "Foto (URL)", "FechaRegistro"],
  Asistencia: ["Cédula", "Fecha", "Hora", "Zona"],
  Líderes: ["Nombre", "ZonaAtención", "Localidad", "Mail", "Teléfono"],
  Configuración: ["Parámetro", "Valor"],
};

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });
let spreadsheetId = process.env.GOOGLE_SHEET_ID;

if (!spreadsheetId) {
  const creada = await sheets.spreadsheets.create({ requestBody: { properties: { title: "Registro de Asistencia Iglesia" }, sheets: Object.keys(hojas).map((title) => ({ properties: { title, gridProperties: { frozenRowCount: 1 } } })) } });
  spreadsheetId = creada.data.spreadsheetId;
} else {
  const actual = await sheets.spreadsheets.get({ spreadsheetId, fields: "sheets.properties.title" });
  const existentes = new Set(actual.data.sheets.map((hoja) => hoja.properties.title));
  const faltantes = Object.keys(hojas).filter((nombre) => !existentes.has(nombre));
  if (faltantes.length) await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: faltantes.map((title) => ({ addSheet: { properties: { title, gridProperties: { frozenRowCount: 1 } } } })) } });
}

await sheets.spreadsheets.values.batchUpdate({ spreadsheetId, requestBody: {
  valueInputOption: "RAW",
  data: Object.entries(hojas).map(([nombre, encabezados]) => ({ range: `'${nombre}'!A1`, values: [encabezados] })),
} });
await sheets.spreadsheets.values.update({ spreadsheetId, range: "'Configuración'!A2:B3", valueInputOption: "RAW", requestBody: { values: [["DomingosInasistencia", "2"], ["HoraEnvioReporte", "09:00"]] } });

console.log(`Hoja configurada correctamente. ID: ${spreadsheetId}`);
console.log("Comparte la hoja con la cuenta de servicio antes de iniciar el backend.");
