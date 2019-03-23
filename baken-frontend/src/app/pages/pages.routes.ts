import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TicketsComponent } from './tickets/tickets.component';
import { ServiciosComponent } from './servicios/servicios.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tickets', component: TicketsComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

export const PAGES_ROUTES = RouterModule.forChild(routes);
