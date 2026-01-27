export interface CotizacionReserva {
    dias: number;
    noches: number;
    total: number;
    detalle: CotizacionDetalle[];
}

export interface CotizacionDetalle {
    tipo: 'DIA' | 'NOCHE';
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    tarifa_uuid: string;
}
  
export interface CotizarReservaRequest {
    espacio: string;      // uuid
    checkin: string;      // YYYY-MM-DD
    checkout: string;     // YYYY-MM-DD
    pax: number;
}
