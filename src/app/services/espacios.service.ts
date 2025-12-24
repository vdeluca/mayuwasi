import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Espacio } from '../interfaces/espacio';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EspaciosService {
  private http = inject(HttpClient);
  private baseUrl = environment.url_base_api + "mayuwasi";

  getEspacios(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(`${this.baseUrl}/espacios/`);
  }
  
}
