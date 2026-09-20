import PQueue from "p-queue";

// Serializa escrituras dentro de una instancia. Para escalar horizontalmente,
// migra a MySQL/PostgreSQL o usa una cola distribuida con clave de idempotencia.
export const colaEscrituras = new PQueue({ concurrency: 1, intervalCap: 55, interval: 60_000 });
