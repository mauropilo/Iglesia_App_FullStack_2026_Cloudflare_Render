import { ReportService } from "../services/reportService.js";
const servicio = new ReportService();
export async function preview(req, res, next) { try { res.json(await servicio.preview(req.body.fecha, Number(req.body.domingos))); } catch (error) { next(error); } }
export async function send(req, res, next) { try { res.json(await servicio.send(req.body.fecha, Number(req.body.domingos), req.body.confirmacion)); } catch (error) { next(error); } }
