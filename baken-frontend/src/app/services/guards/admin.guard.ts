import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(public _usuarioService: UsuarioService, public router: Router) {}
  canActivate() {
    if (this._usuarioService.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      console.log('Bloqueado por el ADMIN GUARD');
      /* this._usuarioService.logout(); */
      /* this.router.navigate(['/login']); */

      this.router.navigate(['/not-authorized']);
      /*error 401 Unauthorized*/
      return false;
    }
  }
}
