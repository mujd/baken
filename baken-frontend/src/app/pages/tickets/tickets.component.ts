import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket.model';
import {
  TicketService,
  UsuarioService,
  UnidadFomentoService
} from '../../services/service.index';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
/* import { ModalUploadService } from '../../components/modal-upload/modal-upload.service'; */
/* import swal from "sweetalert"; */

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  usuario: Usuario;
  totalRegistros = 0;
  cargando = true;
  fechaCreacion: string;
  desde = 0;
  uf: any;
  fechaUf: Date;
  pesos: any;
  fechaHoyUf: Date;
  constructor(
    public _ticketService: TicketService,
    public _usuarioService: UsuarioService,
    public _ufService: UnidadFomentoService
  ) {}

  ngOnInit() {
    this.cargarTickets();
    this.usuario = this._usuarioService.usuario;
  }

  cargarTickets() {
    this.cargando = true;
    this._ticketService
      .cargarTodosTickets(this.desde)
      .subscribe((resp: any) => {
        this.totalRegistros = resp.total;
        const fecha: moment.Moment = moment(resp.tickets.fechaCreacion);
        resp.tickets.fechaCreacion = fecha.toISOString().split('T')[0];
        this.tickets = resp.tickets;
        this.cargando = false;
      });
  }

  buscarTicket(termino: string) {
    if (termino.length <= 0) {
      this.cargarTickets();
      return;
    }
    this._ticketService.buscarTicket(termino).subscribe((tickets: Ticket[]) => {
      this.tickets = tickets;
      this.cargando = false;
    });
  }
  borrarTicket(ticket: Ticket) {
    this._ticketService
      .borrarTicket(ticket._id)
      .subscribe(() => this.cargarTickets());
  }
  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    /* console.log(desde); */

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarTickets();
  }
  cambiarEstado(ticket: Ticket) {
    const anio = new Date().getFullYear();
    const mesNuevo = new Date();
    const mes =
      (mesNuevo.getMonth() < 9 ? '0' : '') + (mesNuevo.getMonth() + 1);
    const dia = new Date().getDate();
    this._ticketService.actualizarEstado(ticket).subscribe();
    this._ufService.cargarUfFecha(anio, mes, dia).subscribe((resp: any) => {
      this.uf = resp.UFs[0].Valor;
      this.fechaUf = resp.UFs[0].Fecha;
      if (ticket.estado === 'PAID') {
        this.cambiarValor(ticket, this.uf);
      }
    });
  }
  cambiarValor(ticket: Ticket, valor: any) {
    this._ticketService.actualizarValor(ticket, valor).subscribe();
  }
  asignarUsuario(ticket: Ticket) {
    this._ticketService.asignarUsuario(ticket).subscribe();
  }

  /* cargarUfFecha(anio: any, mes: any, dia: any) {
    this._ufService.cargarUfFecha(anio, mes, dia).subscribe((resp: any) => {
      this.uf = resp.UFs[0].Valor;
      this.fechaUf = resp.UFs[0].Fecha;
      console.log(resp);
      console.log(this.uf);
      console.log(this.fechaUf);
    });
  } */
}
