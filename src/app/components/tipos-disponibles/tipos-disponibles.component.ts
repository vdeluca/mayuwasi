import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
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
export class TiposDisponiblesComponent implements AfterViewInit {

  constructor(
    private cotizacionService: CotizacionService
  ) {}

  @Input({ required: true })
  tipos: TipoEspacioAgrupado[] = [];

  @Input({ required: true })
  checkin!: string;

  @Input({ required: true })
  checkout!: string;

  @Input({ required: true })
  pax!: number;

  @Output()
  seleccionar = new EventEmitter<number>();

  public url_base_api = environment.url_base_api;

  // Cotizaciones por tipo (key = tipo.id)
  cotizaciones: Record<number, CotizacionReserva> = {};

  ngAfterViewInit(): void {
    this.cotizarTipos();
  }

  private cotizarTipos(): void {
    this.tipos.forEach(tipo => {

      const payload: CotizarReservaRequest = {
        id: tipo.id, // asumimos que el backend acepta tipo o espacio representativo
        checkin: this.checkin,
        checkout: this.checkout,
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
}
