export interface Reserva {
    uuid: string;
    nombre: string;
    pax: number;
    checkin: string;    // ISO Date string
    checkout: string;   // ISO Date string
    dias?: number | null;
    telefono: string;
    email: string;
    observaciones: string;
    deposito: number;
    total: number;
    codigo_operacion: string;
    estado: string;
    espacio: string;    // uuid del espacio
    servicio: string;   // uuid del servicio
    created_at?: string;
    updated_at?: string;
  }
  