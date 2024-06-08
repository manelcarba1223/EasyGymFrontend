import { Sala } from "../sala/sala/sala.component";
import { User } from "../user/user";

export class Actividad {
    id_actividad: number;
    nombre: string;
    descripcion?: string; // Descripción es opcional
    horaInicio: string;
    horaFinal: string;
    capacidad: number;
    users: User[];
    sala: Sala;

    constructor(
        id_actividad: number,
        nombre: string,
        horaInicio: Date,
        horaFinal: Date,
        capacidad: number,
        users: any[],
        sala: Sala
    ) {
        this.id_actividad = id_actividad;
        this.nombre = nombre;
        this.horaInicio = horaInicio.toString();
        this.horaFinal = horaFinal.toString();
        this.capacidad = capacidad;
        this.users = users;
        this.sala = sala;
    }
}
