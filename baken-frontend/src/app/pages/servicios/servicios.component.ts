import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Servicio } from '../../models/servicio.model';
import {
  ServicioService,
  UnidadFomentoService
} from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';

/* declare var swal: any; */

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicio: Servicio = new Servicio('', '', '', '', '');
  /* servicio: Servicio = new Servicio('', ''); */
  servicios: Servicio[] = [];
  pesos: any;
  fechaHoyUf: Date;
  uf: any;
  fechaUf: Date;
  desde = 0;

  totalRegistros = 0;
  cargando = true;

  constructor(
    public _servicioService: ServicioService,
    public _ufService: UnidadFomentoService
  ) {}

  ngOnInit() {
    this.cargarServicios();
    this.cargarUF();
    /* this.calcular(this.uf, 1); */
    this._servicioService.servicioSeleccionado.valorPesos = this.pesos;
    /* this.fechaHoyUf = this.fechaUf; */
  }

  cargarUF() {
    this._ufService.cargarUf().subscribe((resp: any) => {
      this.uf = resp.UFs[0].Valor;
      this.fechaUf = resp.UFs[0].Fecha;
    });
  }
  cargarServicios(desde: number = 0) {
    this.cargando = true;
    this._servicioService.cargarServicios(this.desde).subscribe((resp: any) => {
      this.totalRegistros = resp.total;
      this.servicios = resp.servicios;
      this.cargando = false;
    });
  }

  calcular(num: any, cantidad: number) {
    /* let num = this.uf; */
    num = num.replace('.', '');
    num = num.replace(',', '.');
    this.pesos = num * cantidad;
    this.fechaHoyUf = this.fechaUf;
  }

  buscarServicio(termino: string) {
    if (termino.length <= 0) {
      this.cargarServicios();
      return;
    }
    this.cargando = true;
    this._servicioService
      .buscarServicio(termino)
      .subscribe((servicios: Servicio[]) => {
        this.servicios = servicios;
        this.cargando = false;
      });
  }

  borrarServicio(servicio: Servicio) {
    this._servicioService
      .borrarServicio(servicio._id)
      .subscribe(() => this.cargarServicios());
  }

  actualizarServicio(servicio: Servicio) {
    /* this._servicioService.actualizarServicio(servicio).subscribe(); */
    this._servicioService.servicioSeleccionado = servicio;
  }
  crearServicio(form?: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value);

    if (form.value._id) {
      this._servicioService.actualizarServicio(form.value).subscribe(res => {
        this.resetForm(form);
        this.cargarServicios();
      });
    } else {
      this._servicioService.guardarServicio(form.value).subscribe(() => {
        this.cargarServicios();
        this.resetForm(form);
      });
    }
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this._servicioService.servicioSeleccionado = new Servicio();
    }
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
    this.cargarServicios();
  }
}
