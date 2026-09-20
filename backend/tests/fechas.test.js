import test from "node:test";
import assert from "node:assert/strict";
import { calcularEdad, domingosHasta } from "../src/utils/fechas.js";

test("calcula la edad antes y después del cumpleaños", () => {
  assert.equal(calcularEdad("2000-09-10", new Date("2026-08-28T12:00:00Z")), 25);
  assert.equal(calcularEdad("2000-01-10", new Date("2026-08-28T12:00:00Z")), 26);
});

test("genera domingos ISO desde una fecha de referencia", () => {
  assert.deepEqual(domingosHasta("2026-08-28", 3), ["2026-08-23", "2026-08-16", "2026-08-09"]);
});
