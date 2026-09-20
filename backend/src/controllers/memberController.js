import { MemberService } from "../services/memberService.js";

const servicio = new MemberService();

export async function listNew(_req, res, next) {
  try { res.json({ datos: await servicio.listNew() }); } catch (error) { next(error); }
}
export async function createNew(req, res, next) {
  try { res.status(201).json({ estado: "REGISTRADO", miembro: await servicio.createNew(req.body) }); } catch (error) { next(error); }
}
export async function moveToOld(req, res, next) {
  try { res.json({ estado: "ASIGNADO", miembro: await servicio.moveToOld(req.params.cedula, req.body.lider) }); } catch (error) { next(error); }
}
export async function updatePhoto(req, res, next) {
  try { res.json({ estado: "FOTO_ACTUALIZADA", miembro: await servicio.updatePhoto(req.params.cedula, req.body.fotoUrl) }); } catch (error) { next(error); }
}
