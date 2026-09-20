const bogota = "America/Bogota";

export function ahoraColombia(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: bogota, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(fecha).reduce((acc, item) => ({ ...acc, [item.type]: item.value }), {});
  return { fecha: `${partes.year}-${partes.month}-${partes.day}`, hora: `${partes.hour}:${partes.minute}:${partes.second}` };
}

export function calcularEdad(fechaNacimiento, fechaReferencia = new Date()) {
  const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);
  let edad = fechaReferencia.getUTCFullYear() - anio;
  const mesActual = fechaReferencia.getUTCMonth() + 1;
  if (mesActual < mes || (mesActual === mes && fechaReferencia.getUTCDate() < dia)) edad--;
  return edad;
}

export function domingosHasta(fechaReferenciaISO, cantidad) {
  const fecha = new Date(`${fechaReferenciaISO}T12:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() - fecha.getUTCDay());
  return Array.from({ length: cantidad }, (_, indice) => {
    const domingo = new Date(fecha);
    domingo.setUTCDate(fecha.getUTCDate() - indice * 7);
    return domingo.toISOString().slice(0, 10);
  });
}
