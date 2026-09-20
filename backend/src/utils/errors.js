export class ErrorAplicacion extends Error {
  constructor(mensaje, estado = 400, codigo = "ERROR_APLICACION", detalles) {
    super(mensaje);
    this.name = "ErrorAplicacion";
    this.estado = estado;
    this.codigo = codigo;
    this.detalles = detalles;
  }
}
