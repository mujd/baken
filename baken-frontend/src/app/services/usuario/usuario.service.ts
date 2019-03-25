import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  /* menu: any = []; */
  constructor(public http: HttpClient, public router: Router) {
    /* console.log("Servicio de usuario listo"); */
    this.cargarStorage();
  }

  renuevaToken() {
    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);
        console.log('Token renovado');
        return true;
      }),
      catchError(err => {
        this.router.navigate(['/login']);
        swal(
          'No se pudo renovar token',
          'No fue posible renovar token',
          'error'
        );
        return throwError(err);
      })
    );
  }

  estaLogueado() {
    return this.token.length > 5 ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      /* this.menu = JSON.parse(localStorage.getItem('menu')); */
    } else {
      this.token = '';
      this.usuario = null;
      /* this.menu = []; */
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
  /* guardarStorage(id: string, token: string, usuario: Usuario, menu: any) { */
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    /* localStorage.setItem('menu', JSON.stringify(menu)); */

    this.usuario = usuario;
    this.token = token;
    /* this.menu = menu; */
  }

  logout() {
    this.usuario = null;
    this.token = '';
    /* this.menu = []; */

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    /* localStorage.removeItem('menu'); */

    this.router.navigate(['/login']);
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    const url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        /* this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu); */
      }),
      catchError(err => {
        swal('Error en el login', err.error.mensaje, 'error');
        return throwError(err);
      })
    );
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        swal('Usuario Creado', usuario.email, 'success');
        return resp.usuario;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.error.message, 'error');
        return throwError(err);
      })
    );
  }

  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url);
  }
  cargarTodosUsuarios() {
    const url = URL_SERVICIOS + '/usuario';

    return this.http.get(url);
  }
}
