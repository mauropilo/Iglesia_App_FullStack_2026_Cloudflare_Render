import { esquemaLider } from "../models/schemas.js";
import { repositories } from "../repositories/index.js";
import { ErrorAplicacion } from "../utils/errors.js";

export class LeaderService {
  constructor(dependencias = repositories) { this.repositories = dependencias; }
  list() { return this.repositories.leaders.list(); }
  create(datos) { return this.repositories.leaders.create(esquemaLider.parse(datos)); }
  async update(fila, datos) {
    if (!Number.isInteger(Number(fila)) || Number(fila) < 2) throw new ErrorAplicacion("Fila de líder inválida.", 400, "FILA_INVALIDA");
    return this.repositories.leaders.update(Number(fila), esquemaLider.parse(datos));
  }
  async remove(fila) {
    if (!Number.isInteger(Number(fila)) || Number(fila) < 2) throw new ErrorAplicacion("Fila de líder inválida.", 400, "FILA_INVALIDA");
    return this.repositories.leaders.remove(Number(fila));
  }
}
