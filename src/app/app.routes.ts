import { Routes } from '@angular/router';
import { EspaciosComponent } from './components/espacios/espacios.component';
import { ReservaFormComponent } from './components/reserva-form/reserva-form.component';
import { DisponibilidadCalendarComponent } from './components/disponibilidad-calendar/disponibilidad-calendar.component';
import { DisponibilidadComponent } from './components/disponibilidad/disponibilidad.component';

export const routes: Routes = [
  {
    path: '',
    component: DisponibilidadComponent
  },
  {
    path: 'disponibilidad/:espacioUuid',
    component: DisponibilidadCalendarComponent
  },
  {
    path: 'consultar-disponibilidad',
    component: DisponibilidadComponent
  },
  {
    path: 'reservar/:espacioUuid',
    component: ReservaFormComponent
  },
  {
    path: '**',
    redirectTo: ''
  },
];
