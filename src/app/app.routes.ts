import { Routes } from '@angular/router';
import { EspaciosComponent } from './components/espacios/espacios.component';
import { ReservaFormComponent } from './components/reserva-form/reserva-form.component';

export const routes: Routes = [
  {
    path: '',
    component: EspaciosComponent
  },
  {
    path: 'reservar/:espacioUuid',
    component: ReservaFormComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];
