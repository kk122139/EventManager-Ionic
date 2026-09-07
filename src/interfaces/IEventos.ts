//petición get, put, delete
export interface IEventos{
    id: string;
    nombre: string;
    lugar:string;
    cupos: number;
    fecha:string;
    anfitrion:string;
    portada?: string;
    descripcion:string;
    asistentes: {
        username:string;
        estado: 'registrado' | 'asistió' | 'no asistió';
    }[];
    comentarios:{
        comentario:string;
        user:string;
    }[]
}

//petición post
export interface IEvento{
    nombre: string;
    lugar:string;
    cupos: number;
    fecha:string;
    anfitrion:string;
    portada?: string;
    descripcion:string;
    asistentes: {
        username:string;
        estado: 'registrado' | 'asistió' | 'no asistió';
    }[];
    comentarios:{
        comentario:string;
        user:string;
    }[]
}

