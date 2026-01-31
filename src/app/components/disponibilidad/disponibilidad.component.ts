import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      checkin: [null, Validators.required],
      checkout: [null, Validators.required],
      pax: [1, [Validators.required, Validators.min(1)]],
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const request = {
      checkin: this.form.value.checkin,
      checkout: this.form.value.checkout,
      pax: this.form.value.pax,
    };

    console.log('Request disponibilidad:', request);

    // 👉 acá llamás al backend
  }

  volver(): void {
    // navegación / step atrás
  }

}



