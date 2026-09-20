import { z } from "zod";

export const esquemaMiembroNuevo = z.object({
  cedula: z.string().regex(/^\d{6,12}$/),
  nombres: z.string().trim().min(2).max(80),
  apellidos: z.string().trim().min(2).max(80),
  celular: z.string().trim().min(7).max(20),
  edad: z.number().int().min(0).max(120).optional(),
  fechaNacimiento: z.iso.date(),
  sexo: z.enum(["M", "F", "X"]),
  etapa: z.string().trim().max(60).default(""),
  lugarNacimiento: z.string().trim().max(100).default(""),
  direccion: z.string().trim().max(160).default(""),
  correo: z.union([z.email(), z.literal("")]).default(""),
  estado: z.string().trim().max(30).default("Activo"),
  fechaSalvacion: z.union([z.iso.date(), z.literal("")]).default(""),
  localidad: z.string().trim().max(80).default(""),
  reunionZonal: z.string().trim().max(80).default(""),
  liderZonal: z.string().trim().max(100).default(""),
  zonaAtencion: z.string().trim().max(80).default(""),
  fotoUrl: z.union([z.url(), z.literal("")]).default(""),
});

export const esquemaLider = z.object({
  nombre: z.string().trim().min(3).max(120),
  zonaAtencion: z.string().trim().min(2).max(80),
  localidad: z.string().trim().min(2).max(80),
  mail: z.email(),
  telefono: z.string().trim().min(7).max(20),
});

export const esquemaConfiguracion = z.object({
  domingosInasistencia: z.number().int().min(1).max(12).optional(),
  horaEnvioReporte: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
});
