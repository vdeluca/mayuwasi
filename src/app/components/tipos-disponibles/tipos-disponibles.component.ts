import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tipos-disponibles',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './tipos-disponibles.component.html',
  styleUrl: './tipos-disponibles.component.css',
})
export class TiposDisponiblesComponent {

  @Input({ required: true })
  tipos: any[] = [];

  @Output()
  seleccionar = new EventEmitter<number>();

  public url_base_api = environment.url_base_api;
}
