import { Injectable } from '@angular/core';
/* import { URL_UF } from '../../config/config'; */
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnidadFomentoService {
  constructor(public http: HttpClient) {}
  cargarUf() {
    const url =
      'https://api.sbif.cl/api-sbifv3/recursos_api/uf?apikey=01f60a394ee1a5e6f9d41770de5d319c70419b06&formato=json';
    return this.http.get(url);
  }
  cargarUfFecha(anio: any, mes: any, dia: any) {
    // tslint:disable-next-line:max-line-length
    /* const url = `https://api.sbif.cl/api-sbifv3/recursos_api/uf/2010/01/dias/20?apikey=01f60a394ee1a5e6f9d41770de5d319c70419b06&formato=json`; */
    // tslint:disable-next-line:max-line-length
    const url = `https://api.sbif.cl/api-sbifv3/recursos_api/uf/${anio}/${mes}/dias/${dia}?apikey=01f60a394ee1a5e6f9d41770de5d319c70419b06&formato=json`;

    return this.http.get(url);
  }
}
