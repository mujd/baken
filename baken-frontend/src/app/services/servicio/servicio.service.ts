import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Servicio } from '../../models/servicio.model';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { UsuarioService } from '../usuario/usuario.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  totalServicios = 0;
  servicioSeleccionado: Servicio;
  token: string;
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService,
    public router: Router
  ) {
    this.servicioSeleccionado = new Servicio();
    /* console.log("Servicio de servicio listo"); */
    /* this.cargarStorage(); */
  }

  cargarServicios(desde: number = 0) {
    const url = URL_SERVICIOS + '/servicio?desde=' + desde;
    /* let url = URL_SERVICIOS + "/servicio"; */
    return this.http.get(url);
  }
  cargarServiciosOtro() {
    const limiteServicio = 999;
    const url = URL_SERVICIOS + '/servicio?limite=' + limiteServicio;

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalServicios = resp.total;
        return resp.servicios;
      })
    );
  }
  /* cargarServiciosOtro() {
    let url = URL_SERVICIOS + "/servicio";

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalServicios = resp.total;
        return resp.servicios;
      })
    );
  } */

  obtenerServicio(id: string) {
    const url = URL_SERVICIOS + '/servicio/' + id;
    return this.http.get(url).pipe(map((resp: any) => resp.servicio));
  }

  borrarServicio(id: string) {
    let url = URL_SERVICIOS + '/servicio/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        swal('Servicio borrado', 'Eliminado correctamente', 'success');
        return true;
      })
    );
  }

  /* crearServicio(servicio: Servicio) { */
  crearServicios(nombre: string) {
    let url = URL_SERVICIOS + '/servicio';
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, { tipoSer: nombre }).pipe(
      map((resp: any) => {
        /* resp.servicio; */
        swal('Servicio Creado', nombre, 'success');
        return resp.servicio;
      })
    );
  }
  /* crearServicio(servicio: Servicio) {
    const url = URL_SERVICIOS + '/servicio';
    return this.http.post(url, servicio).pipe(
      map((resp: any) => {
        swal('Servicio Creado', servicio.tipoServicio, 'success');
        return resp.servicio;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.error.message, 'error');
        return throwError(err);
      })
    );
  } */

  buscarServicio(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/servicios/' + termino;
    return this.http.get(url).pipe(map((resp: any) => resp.servicios));
  }

  actualizarServicio(servicio: Servicio) {
    let url = URL_SERVICIOS + '/servicio/' + servicio._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url, servicio).pipe(
      map((resp: any) => {
        swal('Servicio actualizado', servicio.tipoServicio, 'success');
        return resp.servicio;
      })
    );
  }
  guardarServicio(servicio: Servicio) {
    let url = URL_SERVICIOS + '/servicio';

    if (servicio._id) {
      // Actualizando
      url += '/' + servicio._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, servicio).pipe(
        map((resp: any) => {
          swal('Servicio Actualizado', servicio.tipoServicio, 'success');
          return resp.servicio;
        })
      );
    } else {
      // Creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, servicio).pipe(
        map((resp: any) => {
          swal('Servicio Creado', servicio.tipoServicio, 'success');
          return resp.servicio;
        })
      );
    }
  }
}
