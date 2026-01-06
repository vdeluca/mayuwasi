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
    estado: ['Reservado'],
    espacio: [''],
    servicio: [''],
  });

  ngOnInit(): void {
    // Get param from route
    const espacioUuid = this.route.snapshot.paramMap.get('espacioUuid')!;
    if (!espacioUuid) return;

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
            this.router.navigate(['/espacios']);
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

}
