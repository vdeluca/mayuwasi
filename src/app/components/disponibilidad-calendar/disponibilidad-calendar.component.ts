import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ReservasService } from '../../services/reservas.service';
import { ActivatedRoute } from '@angular/router';
import { EspaciosService } from '../../services/espacios.service';
import { Espacio } from '../../interfaces/espacio';

@Component({
  selector: 'app-disponibilidad-calendar',
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './disponibilidad-calendar.component.html',
  styleUrl: './disponibilidad-calendar.component.css',
})
export class DisponibilidadCalendarComponent {
  private reservasService = inject(ReservasService);

  reservas: { checkin: Date; checkout: Date }[] = [];

  private route = inject(ActivatedRoute);
  espacioSeleccionado?: Espacio;
  espaciosService: EspaciosService = inject(EspaciosService);

  ngOnInit(): void {
    const espacioUuid = this.route.snapshot.paramMap.get('espacioUuid')!;

    // Recupera todas las reservas del espacio
    this.reservasService
      .getReservasByEspacio(espacioUuid)
      .subscribe(data => {
        this.reservas = data.map(r => ({
          checkin: new Date(r.checkin),
          checkout: new Date(r.checkout),
        }));
    });

    // buscar el espacio para mostrar su nombre
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

}