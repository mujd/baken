import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiciosComponent } from './servicios/servicios.component';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketComponent } from './tickets/ticket.component';
import { AdminGuard } from '../services/service.index';

const routes: Routes = [
  {
    path: 'servicios',
    component: ServiciosComponent,
    data: { titulo: 'Servicios' }
  },
  {
    path: 'tickets',
    component: TicketsComponent,
    data: { titulo: 'Tickets' }
  },
  {
    path: 'ticket/:id',
    canActivate: [AdminGuard],
    component: TicketComponent,
    data: { titulo: 'Crear/Actualizar Ticket' }
  },
  { path: '**', redirectTo: '/servicios', pathMatch: 'full' }
];

export const PAGES_ROUTES = RouterModule.forChild(routes);
