import { google } from "googleapis";
import { env } from "./env.js";

let cliente;

export async function obtenerSheets() {
  if (cliente) return cliente;
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: env.googleServiceAccountEmail, private_key: env.googlePrivateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  cliente = google.sheets({ version: "v4", auth: await auth.getClient() });
  return cliente;
}
