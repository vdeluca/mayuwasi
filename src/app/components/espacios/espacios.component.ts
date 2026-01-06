import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { EspaciosService } from '../../services/espacios.service';
import { Espacio } from '../../interfaces/espacio';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './espacios.component.html',
  styleUrl: './espacios.component.css',
})
export class EspaciosComponent implements OnInit {

  private espaciosService = inject(EspaciosService);
  private router = inject(Router);

  apiUrl = environment.url_base_api;

  espacios: Espacio[] = [];
  loading = true;

  ngOnInit(): void {
    this.espaciosService.getEspacios().subscribe({
      next: (data) => {
        this.espacios = data;
        this.loading = false;
        console.log(data);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  reservar = (espacio: Espacio): void => {
    this.router.navigate(['/reservar', espacio.uuid]);
  };

  disponibilidad = (espacio: Espacio): void => {
    this.router.navigate([
      'disponibilidad',
      espacio.uuid
    ]);
  };
}
