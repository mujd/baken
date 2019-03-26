import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
/* import { SubirArchivoService } from '../subir-archivo/subir-archivo.service'; */
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { ServicioService } from '../servicio/servicio.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  totalTickets = 0;
  ticketSeleccionado: Ticket;
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService,
    public _servicioService: ServicioService,
    public router: Router
  ) {
    this.ticketSeleccionado = new Ticket();
  }

  cargarTickets() {
    const url = URL_SERVICIOS + '/ticket';

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalTickets = resp.total;
        return resp.tickets;
      })
    );
  }

  cargarTodosTickets(desde: number = 0) {
    const url = URL_SERVICIOS + '/ticket?desde=' + desde;
    return this.http.get(url);
    /* return this.http.get(url).pipe(map((resp: any) => resp.tickets)); */
  }

  cargarTicket(id: string) {
    const url = URL_SERVICIOS + '/ticket/' + id;
    return this.http.get(url);
    /* return this.http.get(url).pipe(map((resp: any) => resp.ticket)); */
  }

  buscarTicket(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/tickets/' + termino;
    return this.http.get(url).pipe(map((resp: any) => resp.tickets));
  }

  borrarTicket(id: string) {
    let url = URL_SERVICIOS + '/ticket/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        swal('Ticket Borrado', 'Ticket borrado correctamente', 'success');
        return resp;
      })
    );
  }

  guardarTicket(ticket: Ticket) {
    let url = URL_SERVICIOS + '/ticket';

    if (ticket._id) {
      // Actualizando
      url += '/' + ticket._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, ticket).pipe(
        map((resp: any) => {
          swal('Ticket Actualizado', ticket.servicio, 'success');
          return resp.ticket;
        })
      );
    } else {
      // Creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, ticket).pipe(
        map((resp: any) => {
          swal('Ticket Creado', ticket.servicio, 'success');
          return resp.ticket;
        })
      );
    }
  }

  actualizarEstado(ticket: Ticket) {
    let url = URL_SERVICIOS + '/ticket/estado/' + ticket._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url, ticket).pipe(
      map((resp: any) => {
        swal('Estado Actualizado', 'Nuevo Estado: ' + ticket.estado, 'success');
        /* console.log(resp.ticket.estado); */
        return resp.ticket;
      })
    );
  }
  actualizarValor(ticket: Ticket, valor: any) {
    let url = URL_SERVICIOS + '/ticket/cambia-valor/' + ticket._id;
    url += '?token=' + this._usuarioService.token;
    let serv: any = this._servicioService.servicioSeleccionado;
    serv = ticket.servicio;
    valor = valor.replace('.', '');
    valor = valor.replace(',', '.');
    const cantidad: any = parseFloat(serv.valorUf);
    const valorNuevo: any = valor * cantidad;
    ticket.valor = valorNuevo;
    return this.http.put(url, ticket).pipe(
      map((resp: any) => {
        swal('Valor Actualizado', 'Nuevo Valor: ' + ticket.valor, 'success');
        return resp.ticket;
      })
    );
  }
  asignarUsuario(ticket: Ticket) {
    let url = URL_SERVICIOS + '/ticket/asignar/' + ticket._id;
    url += '?token=' + this._usuarioService.token;
    const usuario: any = this._usuarioService.usuario;
    ticket.usuario = usuario;
    return this.http.put(url, ticket).pipe(
      map((resp: any) => {
        swal(
          'Usuario Asignado',
          'Nuevo Usuario: ' + this._usuarioService.usuario.nombre,
          'success'
        );
        return resp.ticket;
      })
    );
  }
  calcular(num: any, cantidad: number) {
    /* let num = this.uf; */
  }
}
