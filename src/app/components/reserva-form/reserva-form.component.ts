import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { environment } from '../../../environments/environment';
import { CotizacionReserva, CotizarReservaRequest } from '../../interfaces/cotizacion';
import { Espacio } from '../../interfaces/espacio';
import { CotizacionService } from '../../services/cotizacion.service';
import { EspaciosService } from '../../services/espacios.service';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.css']
})
export class ReservaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reservasService = inject(ReservasService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private espaciosService = inject(EspaciosService);
  private cotizacionService = inject(CotizacionService);

  reservas: { checkin: Date; checkout: Date }[] = [];
  cotizacion?: CotizacionReserva;
  cotizando = false;
  apiUrl = environment.url_base_api;
  espacioSeleccionado?: Espacio;

  form = this.fb.group({
    nombre: ['', Validators.required],
    pax: [1, [Validators.required, Validators.min(1)]],
    checkin: [null as Date | null, Validators.required],
    checkout: [null as Date | null, Validators.required],
    telefono: [''],
    email: ['', Validators.email],
    observaciones: [''],
    deposito: [0],
    total: [0],
    codigo_operacion: [''],
    estado: ['Solicitado'],
    espacio: [''],
    servicio: [''],
  });

  ngOnInit(): void {
    const espacioUuid = this.route.snapshot.paramMap.get('espacioUuid');
    if (!espacioUuid) {
      this.goBack();
      return;
    }

    this.form.patchValue({ espacio: espacioUuid }, { emitEvent: false });

    this.route.queryParamMap.subscribe(params => {
      const checkin = this.parseDateParam(params.get('checkin'));
      const checkout = this.parseDateParam(params.get('checkout'));
      const pax = params.get('pax');

      this.form.patchValue({
        checkin,
        checkout,
        pax: pax ? Number(pax) : this.form.value.pax,
      });

      this.cotizarDesdeFormulario();
    });

    this.espaciosService.getEspacio(espacioUuid).subscribe(espacio => {
      this.espacioSeleccionado = espacio;
      this.cotizarDesdeFormulario();
    });

    const checkinControl = this.form.get('checkin');
    const checkoutControl = this.form.get('checkout');
    const paxControl = this.form.get('pax');

    if (checkinControl && checkoutControl && paxControl) {
      combineLatest([
        checkinControl.valueChanges,
        checkoutControl.valueChanges,
        paxControl.valueChanges,
      ])
        .pipe(
          debounceTime(300),
          distinctUntilChanged(([prevCheckin, prevCheckout, prevPax], [currCheckin, currCheckout, currPax]) =>
            this.toISODate(prevCheckin as Date | string) === this.toISODate(currCheckin as Date | string) &&
            this.toISODate(prevCheckout as Date | string) === this.toISODate(currCheckout as Date | string) &&
            prevPax === currPax
          )
        )
        .subscribe(() => this.cotizarDesdeFormulario());
    }

    this.reservasService.getReservasByEspacio(espacioUuid).subscribe(data => {
      this.reservas = data.map(r => ({
        checkin: new Date(r.checkin),
        checkout: new Date(r.checkout),
      }));
    });
  }

  submit = (): void => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.reservasService.createReserva(this.form.value as any).subscribe({
      next: () => {
        this.snackBar.open('Reserva realizada con éxito', 'Nos comunicaremos por WhatsApp a la brevedad', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 4000);
      },
      error: () => {
        this.snackBar.open('Error al crear la reserva', 'Cerrar', { duration: 4000 });
      }
    });
  };

  goBack = (): void => {
    this.router.navigate(['/']);
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;

    return !this.reservas.some(r =>
      date >= this.stripTime(r.checkin) &&
      date < this.stripTime(r.checkout)
    );
  };

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

  private parseDateParam(value: string | null): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
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

  private cotizarDesdeFormulario(): void {
    const { checkin, checkout, pax } = this.form.value;
    const tipoEspacioId = this.espacioSeleccionado?.tipo_espacio?.id;

    if (!checkin || !checkout || !pax || !tipoEspacioId) {
      this.cotizacion = undefined;
      return;
    }

    const payload: CotizarReservaRequest = {
      id: Number(tipoEspacioId),
      checkin: this.toISODate(checkin),
      checkout: this.toISODate(checkout),
      pax,
    };

    this.cotizando = true;
    this.cotizacionService
      .cotizarReserva(payload)
      .pipe(finalize(() => (this.cotizando = false)))
      .subscribe({
        next: cotizacion => {
          this.cotizacion = cotizacion;
          this.form.patchValue({ total: cotizacion.total }, { emitEvent: false });
        },
        error: () => {
          this.cotizacion = undefined;
        },
      });
  }
}
