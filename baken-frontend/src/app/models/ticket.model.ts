export class Ticket {
  constructor(
    public estado: string,
    public valor: number,
    public servicio?: string,
    public usuario?: string,
    public _id?: string
  ) {}
}
