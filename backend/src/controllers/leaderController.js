import { LeaderService } from "../services/leaderService.js";

const servicio = new LeaderService();
export async function list(_req, res, next) { try { res.json({ datos: await servicio.list() }); } catch (error) { next(error); } }
export async function create(req, res, next) { try { res.status(201).json({ dato: await servicio.create(req.body) }); } catch (error) { next(error); } }
export async function update(req, res, next) { try { res.json({ dato: await servicio.update(req.params.fila, req.body) }); } catch (error) { next(error); } }
export async function remove(req, res, next) { try { await servicio.remove(req.params.fila); res.status(204).end(); } catch (error) { next(error); } }
