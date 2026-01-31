import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { Espacio } from '../../interfaces/espacio';


@Component({
  selector: 'app-disponibilidad',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormField,
    MatIconModule, 
    MatLabel, 
    FormsModule,
    CommonModule
  ],
  templateUrl: './disponibilidad.component.html',
  styleUrl: './disponibilidad.component.css',
})
export class DisponibilidadComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  reservas: { checkin: Date; checkout: Date }[] = [];

  cotizando = false;
  apiUrl = environment.url_base_api;
  
  espacioSeleccionado?: Espacio;

  form = this.fb.group({
    pax: [1, [Validators.required, Validators.min(1)]],
    checkin: ['', Validators.required],
    checkout: ['', Validators.required],
  });
  
  personas: number = 2;



  volver() {
    window.history.back();
  }
  reservar() {
    alert(`Reservando para ${this.personas} personas.`);
  }
}
