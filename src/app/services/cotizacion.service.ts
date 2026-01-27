import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  CotizacionReserva,
  CotizarReservaRequest
} from '../interfaces/cotizacion';

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {

  private base_url = environment.url_base_api + 'mayuwasi';

  constructor(private http: HttpClient) {}

  cotizarReserva(
    payload: CotizarReservaRequest
  ): Observable<CotizacionReserva> {

    return this.http.post<CotizacionReserva>(
      `${this.base_url}/reservas/cotizacion/`,
      payload
    );
  }
}
