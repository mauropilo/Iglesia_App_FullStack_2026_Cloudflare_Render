import test from "node:test";
import assert from "node:assert/strict";
import { parsearEscaneo } from "../src/utils/scanParser.js";

test("conserva los ceros iniciales y divide nombres y apellidos", () => {
  const resultado = parsearEscaneo("0079648456 VARGAS TOMAS MAURO FERNANDO M 19741215 O+");
  assert.equal(resultado.cedula, "0079648456");
  assert.equal(resultado.nombres, "Mauro Fernando");
  assert.equal(resultado.apellidos, "Vargas Tomas");
  assert.equal(resultado.fechaNacimiento, "1974-12-15");
  assert.equal(resultado.rh, "O+");
});

test("rechaza una fecha inexistente", () => {
  assert.throws(() => parsearEscaneo("1012345678 ROJAS PEREZ ANA MARIA F 20260231 A+"), /fecha de nacimiento/i);
});

test("rechaza una entrada incompleta", () => {
  assert.throws(() => parsearEscaneo("1012345678 ROJAS ANA"), /interpretar/i);
});
