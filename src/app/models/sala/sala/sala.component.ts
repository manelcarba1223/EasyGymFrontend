import { HorasDisponibles } from '../../horas-disponibles/horas-disponibles.component';
import { Gimnasio } from '../../gimnasio/gimnasio';
import { Actividad } from '../../actividad/Actividad';


export class Sala {
  idSala: number;
  nombre: string;
  actividades: Actividad[];
  gimnasio: Gimnasio;
  horasDisponibles: HorasDisponibles[];

  constructor(
    idSala: number,
    nombre: string,
    actividades: Actividad[] = [],
    gimnasio: Gimnasio,
    horasDisponibles: HorasDisponibles[] = []
  ) {
    this.idSala = idSala;
    this.nombre = nombre;
    this.actividades = actividades;
    this.gimnasio = gimnasio;
    this.horasDisponibles = horasDisponibles;
  }
}
