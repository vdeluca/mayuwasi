import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { ActivatedRoute } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { EspaciosService } from '../../services/espacios.service';
import { Espacio } from '../../interfaces/espacio';

import { environment } from '../../../environments/environment';

import { CotizacionService } from '../../services/cotizacion.service';
import { CotizacionReserva, CotizarReservaRequest } from '../../interfaces/cotizacion';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


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
  reservas: { checkin: Date; checkout: Date }[] = [];

  private cotizacionService = inject(CotizacionService);
  cotizacion?: CotizacionReserva;
  cotizando = false;
  apiUrl = environment.url_base_api;
  
  espacioSeleccionado?: Espacio;

  form = this.fb.group({
    nombre: ['', Validators.required],
    pax: [1, [Validators.required, Validators.min(1)]],
    checkin: ['', Validators.required],
    checkout: ['', Validators.required],
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
    // Get param from route
    const espacioUuid = this.route.snapshot.paramMap.get('espacioUuid')!;
    if (!espacioUuid) return;
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(values => {
        const { checkin, checkout, pax, espacio } = values;

        if (!checkin || !checkout || !pax || !espacio) {
          this.cotizacion = undefined;
          return;
        }
        const checkin_iso = this.toISODate(checkin);
        const checkout_iso = this.toISODate(checkout);    

        //console.log("Tipo", this.espacioSeleccionado?.tipo_espacio.id);
        // cast espacio to string
        const id_str = Number(this.espacioSeleccionado?.tipo_espacio.id)
        const payload: CotizarReservaRequest = {
          id: id_str, // asumimos que el backend acepta tipo o espacio representativo
          checkin: checkin_iso,
          checkout: checkout_iso,
          pax: pax
        };
        this.cotizando = true;

        this.cotizacionService.cotizarReserva(payload)
          .subscribe({
            next: cotizacion => {
              this.cotizacion = cotizacion;
              this.form.patchValue(
                {
                  total: cotizacion.total,
                },
                { emitEvent: false }
              );
            },
            error: (error) => {
              this.cotizacion = undefined;
              console.log(error);
            },
            complete: () => {
              this.cotizando = false;
            }
        });
      }
    );
      
    this.route.queryParamMap.subscribe(params => {
      const checkin = params. get('checkin');
      const checkout = params.get('checkout');
      const pax = params.get('pax');
    
      this.form.patchValue({
        espacio: espacioUuid,
        checkin: checkin ? this.toBackendDateTime(checkin as unknown as Date) : null,
        checkout: checkout ? this.toBackendDateTime(checkout as unknown as Date): null,
        pax: pax ? Number(pax) : this.form.value.pax,
      });
    
      this.espaciosService.getEspacio(espacioUuid)
        .subscribe(espacio => {
          this.espacioSeleccionado = espacio;
        });
    });
    
    this.route.queryParamMap.subscribe(params => {
      // setear el form
      this.form.patchValue({ espacio: espacioUuid });
  
      // buscar el espacio para mostrar su nombre
      this.espaciosService.getEspacio(espacioUuid)
        .subscribe(espacio => {
          this.espacioSeleccionado = espacio;
          console.log(this.espacioSeleccionado);
        });
    });

    // Recupera todas las reservas del espacio
    this.reservasService
      .getReservasByEspacio(espacioUuid)
      .subscribe(data => {
        this.reservas = data.map(r => ({
        checkin: new Date(r.checkin),
        checkout: new Date(r.checkout),
      }));
    });
  
  }

  submit = (): void => {
    if (this.form.invalid) {
      //Esto no se que hace
      this.form.markAllAsTouched();
      return;
    }
  
    this.reservasService.createReserva(this.form.value as any)
      .subscribe({
        next: () => {
          this.snackBar.open(
            '✅ Reserva realizada con éxito',
            'Ver espacios',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
          );
          // redirigir luego de un pequeño delay
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: () => {
          this.snackBar.open(
            '❌ Error al crear la reserva',
            'Cerrar',
            { duration: 4000 }
          );
        }
      });
  };

  goBack = (): void => {
    this.router.navigate(['/']);
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

  private formatDate(value: Date | string): string {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
  
    // fallback: string
    return new Date(value).toISOString().split('T')[0];
  }

  private toBackendDateTime(date: Date): string {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0); // evita corrimientos por timezone
    return d.toISOString(); // 2026-02-10T12:00:00.000Z
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
