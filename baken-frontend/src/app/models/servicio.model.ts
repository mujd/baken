/* export class Servicio {
  constructor(
    public tipoServicio: string,
    public valorUf: string,
    public _id?: string
  ) {}
} */

export class Servicio {
  constructor(
    _id = '',
    tipoServicio = '',
    valorUf = '',
    valorPesos = '',
    fecha = ''
  ) {
    this._id = _id;
    this.tipoServicio = tipoServicio;
    this.valorUf = valorUf;
    this.valorPesos = valorPesos;
    this.fecha = fecha;
  }

  _id: string;
  tipoServicio: string;
  valorUf: string;
  valorPesos: string;
  fecha: string;
}
