import { ErrorAplicacion } from "./errors.js";

const tokenNombre = "[A-ZÁÉÍÓÚÜÑ'-]+";
const patron = new RegExp(`^(\\d{6,12})\\s+(${tokenNombre})\\s+(${tokenNombre})\\s+(${tokenNombre})\\s+(${tokenNombre})\\s+([MFX])\\s+(\\d{8})\\s+((?:AB|A|B|O)[+-])$`, "iu");

function capitalizar(valor) {
  return valor.toLocaleLowerCase("es-CO").replace(/(^|[\s'-])\p{L}/gu, (letra) => letra.toLocaleUpperCase("es-CO"));
}

function fechaISO(valor) {
  const iso = `${valor.slice(0, 4)}-${valor.slice(4, 6)}-${valor.slice(6, 8)}`;
  const fecha = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== iso) {
    throw new ErrorAplicacion("La fecha de nacimiento del documento no es válida.", 422, "FECHA_ESCANEO_INVALIDA");
  }
  return iso;
}

export function parsearEscaneo(texto) {
  const limpio = String(texto ?? "").trim().replace(/\s+/g, " ");
  const coincidencia = limpio.match(patron);
  if (!coincidencia) {
    throw new ErrorAplicacion("No fue posible interpretar los datos del documento.", 422, "FORMATO_ESCANEO_INVALIDO");
  }
  const [, cedula, apellido1, apellido2, nombre1, nombre2, sexo, nacimiento, rh] = coincidencia;
  return {
    cedula,
    nombres: capitalizar(`${nombre1} ${nombre2}`),
    apellidos: capitalizar(`${apellido1} ${apellido2}`),
    sexo: sexo.toUpperCase(),
    fechaNacimiento: fechaISO(nacimiento),
    rh: rh.toUpperCase(),
    entradaOriginal: limpio,
  };
}
