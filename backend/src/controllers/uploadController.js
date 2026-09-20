import { crearFirmaFoto } from "../services/cloudinaryService.js";

export async function signPhoto(req, res, next) {
  try {
    res.json(crearFirmaFoto(req.body.cedula));
  } catch (error) {
    next(error);
  }
}
