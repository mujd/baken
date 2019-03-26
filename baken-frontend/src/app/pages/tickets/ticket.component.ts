import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Servicio } from '../../models/servicio.model';
import { Ticket } from '../../models/ticket.model';
import { Usuario } from 'src/app/models/usuario.model';
import { TicketService, ServicioService, UsuarioService } from '../../services/service.index';
/* import { ModalUploadService } from '../../components/modal-upload/modal-upload.service'; */
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  servicios: Servicio[] = [];
  tickets: Ticket[] = [];
  ticket: Ticket = new Ticket('', '', '', '', '', '');
  servicio: Servicio = new Servicio('');
  usuario: Usuario;
  fechaCreacion: string;
  valorPesos: any;
  estado: string;
  usuarioNombre: string;
  constructor(
    public _ticketService: TicketService,
    public _servicioService: ServicioService,
    public _usuarioService: UsuarioService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe(params => {
      const id = params['id'];
      const fechaCrea: moment.Moment = moment(new Date());
      if (id !== 'nuevo') {
        this.cargarTicket(id);
      }
      if (id === 'nuevo') {
        this.estado = 'PENDING';
        this.usuarioNombre = this._usuarioService.usuario.nombre;
        this.fechaCreacion = fechaCrea.toISOString().split('T')[0];
      }
    });
  }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
    this._servicioService
      .cargarServiciosOtro()
      .subscribe(servicios => (this.servicios = servicios));
    /* this._modalUploadService.notificacion.subscribe(resp => {
      this.ticket.img = resp.ticket.img;
    }); */
  }

  cargarTicket(id: string) {
    this._ticketService.cargarTicket(id).subscribe((resp: any) => {
      this.ticket = resp.ticket;
      this.estado = resp.ticket.estado;
      this.usuarioNombre = resp.ticket.usuario.nombre;
      this.valorPesos = resp.ticket.servicio.valorPesos;
      this.ticket.servicio = resp.ticket.servicio._id;
      this.cambioValor(this.ticket.servicio);
      this.cambioServicio(this.ticket.servicio);
      const fecha: moment.Moment = moment(this.ticket.fechaCreacion);
      this.fechaCreacion = fecha.toISOString().split('T')[0];
    });
  }

  guardarTicket(f: NgForm) {
    if (f.invalid) {
      return;
    }
    /* console.log(f.value); */
    this._ticketService.guardarTicket(f.value).subscribe(ticket => {
      this.ticket._id = ticket._id;
      this.router.navigate(['/ticket', ticket._id]);
    });
  }

  cambioServicio(id: string) {
    this._servicioService
      .obtenerServicio(id)
      .subscribe(servicio => (this.servicio = servicio));
  }
  cambioValor(id: string) {
    this._servicioService
      .obtenerServicio(id)
      .subscribe(servicio => (this.valorPesos = servicio.valorPesos));
  }
}
