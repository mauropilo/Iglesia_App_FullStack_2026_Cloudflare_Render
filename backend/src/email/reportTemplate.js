export function crearTextoReporte({ lider, zona, fecha, cantidadDomingos, miembros, nuevosAsignados = [], iglesia }) {
  const lista = miembros.length
    ? miembros.map((m) => `- ${m.nombre} | Cédula: ${m.cedula} | Tel: ${m.telefono || "Sin dato"} | Correo: ${m.correo || "Sin dato"} | Última asistencia: ${m.ultimaAsistencia}`).join("\n")
    : "No se encontraron miembros pendientes de seguimiento.";
  const nuevos = nuevosAsignados.length
    ? nuevosAsignados.map((m) => `- ${m.nombre} | Cédula: ${m.cedula} | Tel: ${m.telefono || "Sin dato"}`).join("\n")
    : "No hay nuevos miembros asignados durante la última semana.";
  return `Estimado ${lider},\n\nEste es el reporte de miembros de su zona (${zona}) que no han asistido a los servicios en los últimos ${cantidadDomingos} domingos (hasta el ${fecha}):\n\n${lista}\n\nNuevos miembros asignados a su zona:\n${nuevos}\n\nPor favor, haga seguimiento pastoral.\n\nAtentamente,\n${iglesia}`;
}
