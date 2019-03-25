import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PAGES_ROUTES } from './pages.routes';
import { HomeComponent } from './home/home.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { TicketsComponent } from './tickets/tickets.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent, ServiciosComponent, TicketsComponent],
  imports: [CommonModule, SharedModule, PAGES_ROUTES, FormsModule],
  exports: [],
  providers: []
})
export class PagesModule {}
