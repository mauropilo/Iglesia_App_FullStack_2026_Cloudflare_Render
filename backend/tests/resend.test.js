import test from "node:test";
import assert from "node:assert/strict";
import { enviarCorreoResend } from "../src/services/reportService.js";

test("envía el reporte por la API HTTPS de Resend", async () => {
  let solicitud;
  const fetchFalso = async (url, opciones) => {
    solicitud = { url, opciones };
    return { ok: true, json: async () => ({ id: "correo-123" }) };
  };
  const respuesta = await enviarCorreoResend({ to: "lider@example.com", subject: "Reporte", text: "Contenido" }, fetchFalso);
  assert.equal(respuesta.id, "correo-123");
  assert.equal(solicitud.url, "https://api.resend.com/emails");
  assert.equal(JSON.parse(solicitud.opciones.body).to[0], "lider@example.com");
});
