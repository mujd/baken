export class Ticket {
  constructor(
    _id = '',
    estado = '',
    servicio = '',
    valor = '',
    fechaCreacion = '',
    usuario = ''
  ) {
    this._id = _id;
    this.estado = estado;
    this.servicio = servicio;
    this.valor = valor;
    this.fechaCreacion = fechaCreacion;
    this.usuario = usuario;
  }

  _id?: string;
  estado: string;
  servicio?: string;
  valor: string;
  fechaCreacion: string;
  usuario?: string;
}
