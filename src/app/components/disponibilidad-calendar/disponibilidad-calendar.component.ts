import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ReservasService } from '../../services/reservas.service';

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
  @Input({ required: true }) espacioUuid!: string;

  private reservasService = inject(ReservasService);

  reservas: { checkin: Date; checkout: Date }[] = [];

  ngOnInit(): void {
    this.reservasService
      .getReservasByEspacio(this.espacioUuid)
      .subscribe(data => {
        this.reservas = data.map(r => ({
          checkin: new Date(r.checkin),
          checkout: new Date(r.checkout),
        }));
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