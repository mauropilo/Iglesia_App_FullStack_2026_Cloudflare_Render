const cadenas = new Map();

// Evita registros duplicados simultáneos para la misma persona dentro del proceso.
export async function conBloqueo(clave, tarea) {
  const anterior = cadenas.get(clave) ?? Promise.resolve();
  let liberar;
  const turno = new Promise((resolve) => { liberar = resolve; });
  const cadenaActual = anterior.then(() => turno);
  cadenas.set(clave, cadenaActual);
  await anterior;
  try { return await tarea(); }
  finally {
    liberar();
    if (cadenas.get(clave) === cadenaActual) cadenas.delete(clave);
  }
}
