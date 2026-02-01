import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { agruparPorTipoEspacio } from '../../interfaces/espacio'
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TiposDisponiblesComponent } from '../tipos-disponibles/tipos-disponibles.component';



@Component({
  selector: 'app-disponibilidad',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    CommonModule,
    MatNativeDateModule,
    TiposDisponiblesComponent,
  ],
  templateUrl: './disponibilidad.component.html',
  styleUrl: './disponibilidad.component.css',
})
export class DisponibilidadComponent implements OnInit {

  form!: FormGroup;

  capacidadMaxima = 5; // podés setearlo desde espacioSeleccionado

  tiposAgrupados: any[] = []; // acá van los resultados agrupados

  router = inject(Router);

  private snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder, 
    private dispobilidadService: DisponibilidadService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      checkin: [null, Validators.required],
      checkout: [null, Validators.required],
      pax: [2, [Validators.required, Validators.min(1)]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.snackBar.open(
        'Completá correctamente las fechas y la cantidad de personas',
        'Cerrar',
        { duration: 4000 }
      );
      return;
    }
  
    const { checkin, checkout, pax } = this.form.value;
  
    this.dispobilidadService
      .getDisponibilidadCabanas(
        this.toISODate(checkin),
        this.toISODate(checkout),
        pax
      )
      .subscribe({
        next: (espacios) => {
          if (!espacios || espacios.length === 0) {
            this.snackBar.open(
              'No hay cabañas disponibles para las fechas seleccionadas',
              'Cerrar',
              { duration: 5000 }
            );
            this.tiposAgrupados = [];
            return;
          }
  
          // agrupamos
          this.tiposAgrupados = agruparPorTipoEspacio(espacios);
  
          // si hay una sola cabaña disponible → redirección directa
          if (espacios.length === 1) {
            // Toma la primer cabaña de la lista si solo devuelve un tipo de cabaña
            const espacioUuid = espacios[0].uuid;
            this.router.navigate(['reservar', espacioUuid]);
            return;
          }
  
          // si hay varias, seguimos mostrando el listado agrupado
          console.log('Tipos agrupados:', this.tiposAgrupados);
        },
  
        error: (err) => {
          this.mostrarErrorBackend(err);
        }
      });
  }
    
  volver(): void {
    // navegación / step atrás
  }

  private mostrarErrorBackend(err: any): void {
    let mensaje = 'Error consultando disponibilidad';
  
    if (err?.error?.non_field_errors?.length) {
      mensaje = err.error.non_field_errors[0];
    }
  
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 6000,
    });
  }
  

  private toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  onSeleccionarTipo(tipoId: number): void {
    const tipo = this.tiposAgrupados.find(t => t.id === tipoId);
  
    if (!tipo || tipo.espacios.length === 0) {
      this.snackBar.open(
        'No se encontró una cabaña disponible para este tipo',
        'Cerrar',
        { duration: 4000 }
      );
      return;
    }
  
    const primerEspacio = tipo.espacios[0];
    this.router.navigate(['reservar', primerEspacio.uuid]);
  }
    
}



