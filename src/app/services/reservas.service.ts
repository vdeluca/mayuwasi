import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../interfaces/reserva';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private http = inject(HttpClient);

  private baseUrl = environment.url_base_api + "mayuwasi";

  createReserva = (payload: Reserva): Observable<Reserva> =>
    this.http.post<Reserva>(`${this.baseUrl}/reserva/create/`, payload);

  getReserva = (uuid: string): Observable<Reserva> =>
    this.http.get<Reserva>(`${this.baseUrl}/reserva/${uuid}/`);

  updateReserva = (uuid: string, payload: Partial<Reserva>): Observable<Reserva> =>
    this.http.put<Reserva>(`${this.baseUrl}/reserva/${uuid}/update/`, payload);

  deleteReserva = (uuid: string): Observable<any> =>
    this.http.delete(`${this.baseUrl}/reserva/${uuid}/delete/`);
}
