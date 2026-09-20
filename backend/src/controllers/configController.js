import { esquemaConfiguracion } from "../models/schemas.js";
import { repositories } from "../repositories/index.js";
export async function getConfig(_req, res, next) { try { res.json(await repositories.config.getAll()); } catch (error) { next(error); } }
export async function updateConfig(req, res, next) {
  try {
    const datos = esquemaConfiguracion.parse({ ...req.body, domingosInasistencia: req.body.domingosInasistencia == null ? undefined : Number(req.body.domingosInasistencia) });
    if (datos.domingosInasistencia != null) await repositories.config.set("DomingosInasistencia", datos.domingosInasistencia);
    if (datos.horaEnvioReporte != null) await repositories.config.set("HoraEnvioReporte", datos.horaEnvioReporte);
    res.json({ estado: "CONFIGURACION_ACTUALIZADA", datos });
  } catch (error) { next(error); }
}
