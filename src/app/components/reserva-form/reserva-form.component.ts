import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input type="text" placeholder="Nombre" formControlName="nombre" />
      <input type="number" placeholder="PAX" formControlName="pax" />
      <input type="datetime-local" formControlName="checkin" />
      <input type="datetime-local" formControlName="checkout" />
      <button type="submit">Guardar</button>
    </form>
  `
})
export class ReservaFormComponent {

  private fb = inject(FormBuilder);
  private reservasService = inject(ReservasService);

  form = this.fb.group({
    nombre: ['', Validators.required],
    pax: [1, Validators.required],
    checkin: ['', Validators.required],
    checkout: ['', Validators.required],
    telefono: [''],
    email: [''],
    observaciones: [''],
    deposito: [0],
    total: [0],
    codigo_operacion: [''],
    estado: ['Reservado'],
    espacio: [''],
    servicio: [''],
  });

  submit = () => {
    if (this.form.invalid) return;

    this.reservasService.createReserva(this.form.value as any)
      .subscribe(res => {
        console.log('Reserva creada:', res);
      });
  }
}
