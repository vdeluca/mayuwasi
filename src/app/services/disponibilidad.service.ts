import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Espacio } from '../interfaces/espacio';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class DisponibilidadService {
  private http = inject(HttpClient);
  private baseUrl = environment.url_base_api + "mayuwasi";

  getDisponibilidadCabanas(checkin: string, checkout: string, pax: number): Observable<Espacio[]> {
    return this.http.post<Espacio[]>(`${this.baseUrl}/espacios/disponibles/`, 
      {
        checkin: checkin,
        checkout: checkout,
        pax: pax.toString(),
      });
  }



}
