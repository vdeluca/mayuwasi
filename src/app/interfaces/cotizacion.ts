export interface CotizarReservaRequest {
    id: number;  
    checkin: string;   // YYYY-MM-DD
    checkout: string;  // YYYY-MM-DD
    pax: number;
    late_checkout?: boolean;
  }
  
  export interface CotizacionReserva {
    espacio: string;
    checkin: string;
    checkout: string;
    pax: number;
    total: number;
    detalle: CotizacionDetalle[];
  }
  
  export interface CotizacionDetalle {
    fecha: string;              // YYYY-MM-DD
    tipo_periodo: 'semana' | 'finde';
    precio_base: number;
    pax_extra: number;
    subtotal: number;
  }
  