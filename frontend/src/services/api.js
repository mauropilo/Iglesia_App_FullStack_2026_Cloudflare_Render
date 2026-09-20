const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export function crearApi(obtenerToken) {
  async function solicitar(ruta, opciones = {}) {
    const token = await obtenerToken();
    const respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...opciones.headers },
    });
    const datos = respuesta.status === 204 ? null : await respuesta.json();
    if (!respuesta.ok) throw new Error(datos?.error?.mensaje ?? "No fue posible completar la operación.");
    return datos;
  }
  return {
    escanear: (datosEscaneo) => solicitar("/asistencias/escanear", { method: "POST", body: JSON.stringify({ datosEscaneo }) }),
    dashboard: (fecha) => solicitar(`/dashboard${fecha ? `?fecha=${fecha}` : ""}`),
    nuevos: () => solicitar("/miembros/nuevos"),
    crearNuevo: (datos) => solicitar("/miembros/nuevos", { method: "POST", body: JSON.stringify(datos) }),
    moverNuevo: (cedula, lider) => solicitar(`/miembros/nuevos/${cedula}/mover`, { method: "POST", body: JSON.stringify({ lider }) }),
    firmarFoto: (cedula) => solicitar("/archivos/fotos/firma", { method: "POST", body: JSON.stringify({ cedula }) }),
    lideres: () => solicitar("/lideres"),
    vistaReporte: (fecha, domingos) => solicitar("/reportes/inasistencia/preview", { method: "POST", body: JSON.stringify({ fecha, domingos }) }),
    enviarReporte: (fecha, domingos) => solicitar("/reportes/inasistencia/enviar", { method: "POST", body: JSON.stringify({ fecha, domingos, confirmacion: "ENVIAR_REPORTES" }) }),
    actualizarFoto: (cedula, fotoUrl) => solicitar(`/miembros/${cedula}/foto`, { method: "PUT", body: JSON.stringify({ fotoUrl }) }),
  };
}
