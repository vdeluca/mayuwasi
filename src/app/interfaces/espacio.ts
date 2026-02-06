  

export interface TipoEspacio {
    id: number;
    definicion: string;
    descripcion: string;
    informacion: string;
    capacidad: number;
    imagen_portada: string | null;
}
  
export interface Espacio {
    uuid: string;
    tipo_espacio: TipoEspacio;
    titulo: string;
    subtitulo: string;
    imagen1: string | null;
    imagen2: string | null;
    imagen3: string | null;
    imagen4: string | null;
    imagen5: string | null;
}
  
export interface TipoEspacioAgrupado extends TipoEspacio {
    suma: number;
    espacios: Espacio[];
  }
  
  export const agruparPorTipoEspacio =
  (espacios: Espacio[]): TipoEspacioAgrupado[] => {

    const mapa = espacios.reduce<Record<number, TipoEspacioAgrupado>>(
      (acc, espacio) => {
        const tipo = espacio.tipo_espacio;

        if (!acc[tipo.id]) {
          acc[tipo.id] = {
            ...tipo,
            suma: 0,
            espacios: [],
          };
        }

        acc[tipo.id].suma += 1;
        acc[tipo.id].espacios.push(espacio);

        return acc;
      },
      {}
    );

    return Object.values(mapa);
};
  