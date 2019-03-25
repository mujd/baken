import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './login/register.component';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuardGuard, VerificaTokenGuard } from './services/service.index';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    canActivate: [LoginGuardGuard],
    canActivateChild: [VerificaTokenGuard],
    component: PagesComponent,
    loadChildren: './pages/pages.module#PagesModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
