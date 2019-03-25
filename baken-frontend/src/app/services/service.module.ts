import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  /* LoginGuardGuard,
  AdminGuard,
  VerificaTokenGuard, */

  UsuarioService
} from './service.index';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    /* LoginGuardGuard,
    AdminGuard,
    VerificaTokenGuard, */
    UsuarioService
  ],
  declarations: []
})
export class ServiceModule {}
