export class Ejercicio {
  id_ejercicio!: number;
  nombre!: string;
  descripcion?: string;
  musculoPrincipal!: string;
  musculoSecundario?: string[]; // musculoSecundario es opcional y un conjunto de strings
  constructor(id_ejercicio: number, nombre: string, musculoPrincipal: string, descripcion?: string, musculoSecundario?: string[]) {
    this.id_ejercicio = id_ejercicio;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.musculoPrincipal = musculoPrincipal;
    this.musculoSecundario = musculoSecundario;
  }
}
