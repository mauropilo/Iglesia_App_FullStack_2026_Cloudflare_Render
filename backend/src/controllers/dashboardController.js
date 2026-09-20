import { DashboardService } from "../services/dashboardService.js";
const servicio = new DashboardService();
export async function summary(req, res, next) { try { res.json(await servicio.summary(req.query.fecha)); } catch (error) { next(error); } }
