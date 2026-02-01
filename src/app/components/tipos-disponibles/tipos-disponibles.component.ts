import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tipos-disponibles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tipos-disponibles.component.html',
  styleUrl: './tipos-disponibles.component.css',
})
export class TiposDisponiblesComponent {

  @Input({ required: true })
  tipos: any[] = [];

  @Output()
  seleccionar = new EventEmitter<number>();
}
