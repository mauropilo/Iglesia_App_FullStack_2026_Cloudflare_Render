import { AttendanceService } from "../services/attendanceService.js";

const servicio = new AttendanceService();

export async function scan(req, res, next) {
  try { res.status(200).json(await servicio.scan(req.body.datosEscaneo)); }
  catch (error) { next(error); }
}
