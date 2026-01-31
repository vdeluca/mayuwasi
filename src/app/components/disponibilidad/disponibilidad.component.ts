import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DisponibilidadService } from '../../services/disponibilidad.service';


@Component({
  selector: 'app-disponibilidad',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    CommonModule,
    MatNativeDateModule
  ],
  templateUrl: './disponibilidad.component.html',
  styleUrl: './disponibilidad.component.css',
})
export class DisponibilidadComponent implements OnInit {

  form!: FormGroup;

  capacidadMaxima = 5; // podés setearlo desde espacioSeleccionado

  constructor(private fb: FormBuilder, 
    private dispobilidadService: DisponibilidadService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      checkin: [null, Validators.required],
      checkout: [null, Validators.required],
      pax: [1, [Validators.required, Validators.min(1)]],
    });
  }

  submit(): void {
    if (this.form.invalid) return;
  
    const checkin: Date = this.form.value.checkin;
    const checkout: Date = this.form.value.checkout;
    const pax: number = this.form.value.pax;
  
    console.log(this.toISODate(checkin));
    this.dispobilidadService
      .getDisponibilidadCabanas(
        this.toISODate(checkin),
        this.toISODate(checkout),
        pax
      )
      .subscribe({
        next: (espacios) => {
          console.log('Cabañas disponibles:', espacios);
          // acá luego:
          // this.espaciosDisponibles = espacios;
        },
        error: (err) => {
          console.error('Error consultando disponibilidad', err);
        }
      });
  }
  
  volver(): void {
    // navegación / step atrás
  }


  private toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
}



