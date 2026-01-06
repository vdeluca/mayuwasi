import { Routes } from '@angular/router';
import { EspaciosComponent } from './components/espacios/espacios.component';
import { ReservaFormComponent } from './components/reserva-form/reserva-form.component';
import { DisponibilidadCalendarComponent } from './components/disponibilidad-calendar/disponibilidad-calendar.component';

export const routes: Routes = [
  {
    path: '',
    component: EspaciosComponent
  },
  {
    path: 'disponibilidad/:espacioUuid',
    component: DisponibilidadCalendarComponent},
  {
    path: 'reservar/:espacioUuid',
    component: ReservaFormComponent
  },
  {
    path: '**',
    redirectTo: ''
  },
];
