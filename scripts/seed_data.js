#!/usr/bin/env node
import "dotenv/config";
import { google } from "googleapis";

if (process.env.ALLOW_SEED !== "true") throw new Error("Define ALLOW_SEED=true para confirmar la carga de datos ficticios.");
const spreadsheetId = process.env.GOOGLE_SHEET_ID;
if (!spreadsheetId) throw new Error("Falta GOOGLE_SHEET_ID.");
const auth = new google.auth.GoogleAuth({ credentials: { client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, private_key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n") }, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });

await sheets.spreadsheets.values.batchUpdate({ spreadsheetId, requestBody: { valueInputOption: "RAW", data: [
  { range: "'Líderes'!A2", values: [["Daniel Rojas", "Norte", "Suba", "daniel@example.com", "3001002000"], ["Ana Torres", "Centro", "Teusaquillo", "ana@example.com", "3001003000"]] },
  { range: "'Antiguos'!A2", values: [["1012345678", "Sofía Elena", "Rojas Pérez", "3001112233", 34, "1992-06-18", "F", "Consolidación", "Bogotá", "Dato ficticio", "sofia@example.com", "Activo", "2024-05-12", "Suba", "Norte 1", "Daniel Rojas", "Norte", ""]] },
] } });
console.log("Datos ficticios cargados. No contienen información real de miembros.");
