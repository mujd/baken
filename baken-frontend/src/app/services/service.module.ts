import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  LoginGuardGuard,
  AdminGuard,
  VerificaTokenGuard,
  UsuarioService,
  ServicioService,
  TicketService,
  UnidadFomentoService
} from './service.index';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    LoginGuardGuard,
    AdminGuard,
    VerificaTokenGuard,
    UsuarioService,
    ServicioService,
    TicketService,
    UnidadFomentoService
  ],
  declarations: []
})
export class ServiceModule {}
