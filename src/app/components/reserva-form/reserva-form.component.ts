import { Component, inject } from '@angular/core';
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
    MatIconModule
  ],
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.css']
})
export class ReservaFormComponent {

  private fb = inject(FormBuilder);
  private reservasService = inject(ReservasService);

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
    espacio: ['3038e12f-d862-42b6-ac3b-dd7916a4935d'],
    servicio: [''],
  });

  submit = (): void => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.reservasService.createReserva(this.form.value as any)
      .subscribe(res => {
        console.log('Reserva creada:', res);
      });
  };
}
