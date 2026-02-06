import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';
import { TipoEspacioAgrupado } from '../../interfaces/espacio';
import { CotizarReservaRequest, CotizacionReserva } from '../../interfaces/cotizacion';
import { CotizacionService } from '../../services/cotizacion.service';

@Component({
  selector: 'app-tipos-disponibles',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './tipos-disponibles.component.html',
  styleUrl: './tipos-disponibles.component.css',
})
export class TiposDisponiblesComponent implements OnChanges {

  constructor(
    private cotizacionService: CotizacionService
  ) {}

  @Input({ required: true })
  tipos: TipoEspacioAgrupado[] = [];

  @Input({ required: true })
  checkin!: Date | string;

  @Input({ required: true })
  checkout!: Date | string;

  @Input({ required: true })
  pax!: number;

  @Output()
  seleccionar = new EventEmitter<number>();

  public url_base_api = environment.url_base_api;

  // Cotizaciones por tipo (key = tipo.id)
  cotizaciones: Record<number, CotizacionReserva> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['tipos'] ||
      changes['checkin'] ||
      changes['checkout'] ||
      changes['pax']
    ) {
      this.cotizaciones = {};
      this.cotizarTipos();
    }
  }

  private cotizarTipos(): void {
    const checkin = this.toISODate(this.checkin);
    const checkout = this.toISODate(this.checkout);

    if (!checkin || !checkout || !this.pax || this.tipos.length === 0) {
      return;
    }

    this.tipos.forEach(tipo => {
      const payload: CotizarReservaRequest = {
        id: tipo.id, // asumimos que el backend acepta tipo o espacio representativo
        checkin,
        checkout,
        pax: this.pax
      };

      this.cotizacionService.cotizarReserva(payload).subscribe({
        next: (cotizacion) => {
          this.cotizaciones[tipo.id] = cotizacion;
        },
        error: () => {
          // si no hay tarifa o falla algo, simplemente no mostramos precio
          console.warn('No se pudo cotizar tipo', tipo.id);
        }
      });

    });
  }

  getCotizacion(tipoId: number): CotizacionReserva | null {
    return this.cotizaciones[tipoId] ?? null;
  }

  private toISODate(value: Date | string): string {
    if (!value) {
      return '';
    }

    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }

    return value.includes('T') ? value.split('T')[0] : value;
  }
}
