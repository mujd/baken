import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  recuerdame = false;
  constructor(public router: Router, public _usuarioService: UsuarioService) {}

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }
  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }

    const usuario = new Usuario(
      null,
      forma.value.email,
      forma.value.password,
      null,
      null
    );

    this._usuarioService
      .login(usuario, forma.value.recuerdame)
      .subscribe(correcto => this.router.navigate(['/servicios']));
  }
}
