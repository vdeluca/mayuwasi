import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { ReservasService } from '../../services/reservas.service';
import { ActivatedRoute } from '@angular/router';
import { EspaciosService } from '../../services/espacios.service';
import { Espacio } from '../../interfaces/espacio';
import { environment } from '../../../environments/environment';

import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-disponibilidad-calendar',
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule
  ],
  templateUrl: './disponibilidad-calendar.component.html',
  styleUrl: './disponibilidad-calendar.component.css',
})
export class DisponibilidadCalendarComponent {
  private reservasService = inject(ReservasService);
  private router = inject(Router);

  reservas: { checkin: Date; checkout: Date }[] = [];

  private route = inject(ActivatedRoute);
  espacioSeleccionado?: Espacio;
  espaciosService: EspaciosService = inject(EspaciosService);
  form: any;
  apiUrl = environment.url_base_api;

  reservasCargadas = false;

  ngOnInit(): void {
    const espacioUuid = this.route.snapshot.paramMap.get('espacioUuid')!;
  
    this.reservasService
      .getReservasByEspacio(espacioUuid)
      .subscribe(data => {
        this.reservas = data.map(r => ({
          checkin: new Date(r.checkin),
          checkout: new Date(r.checkout),
        }));
  
        this.reservasCargadas = true; // 👈 clave
      });
  
    this.espaciosService.getEspacio(espacioUuid)
      .subscribe(espacio => {
        this.espacioSeleccionado = espacio;
      });
  }
  
  /** Deshabilita días ocupados */
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return !this.reservas.some(r =>
      date >= this.stripTime(r.checkin) &&
      date < this.stripTime(r.checkout)
    );
  };

  /** Marca visualmente días ocupados */
  dateClass = (date: Date): string => {
    const ocupado = this.reservas.some(r =>
      date >= this.stripTime(r.checkin) &&
      date < this.stripTime(r.checkout)
    );
    return ocupado ? 'ocupado' : '';
  };

  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }


  volver(): void {
    this.router.navigate(['/']);
  }

  reservar(): void {
    if (!this.espacioSeleccionado) return;

    this.router.navigate(['/reservar', this.espacioSeleccionado.uuid]);
  }


}