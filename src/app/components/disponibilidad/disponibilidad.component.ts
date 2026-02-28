import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { agruparPorTipoEspacio, TipoEspacioAgrupado } from '../../interfaces/espacio'
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TiposDisponiblesComponent } from '../tipos-disponibles/tipos-disponibles.component';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';


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

  private destroyRef = inject(DestroyRef);
  private busquedaIniciada = false;

  form!: FormGroup;

  capacidadMaxima = 5; // podés setearlo desde espacioSeleccionado

  tiposAgrupados: TipoEspacioAgrupado[] = []; // acá van los resultados agrupados

  router = inject(Router);

  private snackBar = inject(MatSnackBar);

  checkinDate!: Date;
  checkoutDate!: Date;
  paxSeleccionado!: number;  


  constructor(private fb: FormBuilder, 
    private dispobilidadService: DisponibilidadService) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        checkin: [null, Validators.required],
        checkout: [null, Validators.required],
        pax: [2, [Validators.required, Validators.min(1)]],
      },
      { validators: rangoFechasValidator }
    );

    this.form.valueChanges
      .pipe(
        debounceTime(300),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (!this.busquedaIniciada || this.form.invalid) {
          return;
        }

        this.buscarDisponibilidad(false);
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

    this.busquedaIniciada = true;
    this.buscarDisponibilidad(true);
  }

  private buscarDisponibilidad(redireccionarSiEsUnica: boolean): void {
    const { checkin, checkout, pax } = this.form.value;

    this.checkinDate = checkin;
    this.checkoutDate = checkout;
    this.paxSeleccionado = pax;

    this.dispobilidadService
      .getDisponibilidadCabanas(
        this.toISODate(checkin),
        this.toISODate(checkout),
        pax
      )
      .subscribe({
        next: (espacios) => {
          if (!espacios || espacios.length === 0) {
            this.tiposAgrupados = [];
            return;
          }

          this.tiposAgrupados = agruparPorTipoEspacio(espacios);

          if (redireccionarSiEsUnica && espacios.length === 1) {
            const espacioUuid = espacios[0].uuid;
            this.router.navigate(['reservar', espacioUuid]);
          }
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
  private toISODateTime(date: Date): string {
    return date.toISOString(); // 2026-02-10T00:00:00.000Z
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

    const espacioUuid = tipo.espacios[0].uuid;

    this.router.navigate(
      ['reservar', espacioUuid],
      {
        queryParams: {
          checkin: this.toISODateTime(this.checkinDate),
          checkout: this.toISODateTime(this.checkoutDate),
          pax: this.paxSeleccionado,
        },
      }
    );
    
  }

  dateClass: MatCalendarCellClassFunction<Date> = (date, view) => {
    if (view !== 'month') return '';
  
    const day = date.getDay(); // 0 domingo, 6 sábado
  
    if (day === 0) return 'domingo';
    if (day === 6) return 'sabado';
  
    return '';
  };
  
  
}

import { AbstractControl, ValidationErrors } from '@angular/forms';

export function rangoFechasValidator(
  control: AbstractControl
): ValidationErrors | null {
  const checkin = control.get('checkin')?.value;
  const checkout = control.get('checkout')?.value;

  if (!checkin || !checkout) return null;

  return checkin < checkout
    ? null
    : { rangoFechasInvalido: true };
}

