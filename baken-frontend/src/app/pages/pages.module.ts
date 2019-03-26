import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PAGES_ROUTES } from './pages.routes';
import { ServiciosComponent } from './servicios/servicios.component';
import { TicketsComponent } from './tickets/tickets.component';
import { FormsModule } from '@angular/forms';
import { TicketComponent } from './tickets/ticket.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [ServiciosComponent, TicketsComponent, TicketComponent],
  imports: [CommonModule, SharedModule, PAGES_ROUTES, FormsModule, PipesModule],
  exports: [],
  providers: []
})
export class PagesModule {}
