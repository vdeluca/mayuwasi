import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../interfaces/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private http = inject(HttpClient);

  // En dev apuntamos al backend local de Django:
  private baseUrl = 'http://127.0.0.1:8000';

  createReserva = (payload: Reserva): Observable<Reserva> =>
    this.http.post<Reserva>(`${this.baseUrl}/reservas/`, payload);

  getReserva = (uuid: string): Observable<Reserva> =>
    this.http.get<Reserva>(`${this.baseUrl}/reserva/${uuid}/`);

  updateReserva = (uuid: string, payload: Partial<Reserva>): Observable<Reserva> =>
    this.http.put<Reserva>(`${this.baseUrl}/reserva/${uuid}/update/`, payload);

  deleteReserva = (uuid: string): Observable<any> =>
    this.http.delete(`${this.baseUrl}/reserva/${uuid}/delete/`);
}
