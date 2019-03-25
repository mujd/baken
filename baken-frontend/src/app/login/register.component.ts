import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.scss']
})
export class RegisterComponent implements OnInit {
  usuario: Usuario = new Usuario('', '', '', '');
  roles = [{ value: 'ADMIN_ROLE', role: 'Administrador' }, { value: 'TEC_ROLE', role: 'Técnico' }];
  constructor(public _usuarioService: UsuarioService, public router: Router) {}

  ngOnInit() {}

  registrarUsuario(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this._usuarioService
      .crearUsuario(this.usuario)
      .subscribe(resp => this.router.navigate(['/login']));
  }
}
