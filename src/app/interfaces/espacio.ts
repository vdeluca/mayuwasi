  
/**
{
    "uuid": "ec97a9cd-de71-4b68-b7a4-60375739b903",
    "tipo_espacio": {
        "id": 1,
        "definicion": "Cabaña I",
        "descripcion": "Monoambiente de 1 nivel. para 2 o 3 personas.",
        "informacion": "Cama matrimoñal y posibilidad de cama chica.\r\nCocina equipada con heladera anafe a gas, pava eléctrica, utensilios de cocina.\r\nAire Acondicionado.\r\nCalefacción.\r\nAgua caliente por termotanque, jabón de tocador.\r\nDeck techado.\r\nParrilla individual.\r\nIncluye blanquería: sábanas, toallas de ducha, mantas.\r\n\r\nNo incluye toallas de piscina.",
        "capacidad": 1
    },
    "titulo": "Cabaña simple",
    "subtitulo": "Cabaña de una planta tipo monoambiente",
    "imagen1": "/media/images/bungalow_1_teMJ2lS.jpg",
    "imagen2": null,
    "imagen3": null,
    "imagen4": null,
    "imagen5": null
} */
export interface Espacio {
    uuid: string;
    tipo_espacio: {
        id: number;
        definicion: string;
        descripcion: string;
        informacion: string;
        capacidad: number;
    }
    titulo: string;
    subtitulo: string;
    imagen1: string | null;
    imagen2: string | null;
    imagen3: string | null;
    imagen4: string | null;
    imagen5: string | null;

}