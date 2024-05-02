import { User } from "../user/user";

export class Gimnasio {
    id_gimnasio!: number;
    nombre!: string;
    logo!: Uint8Array; // Aquí asumo que logo es un arreglo de bytes
    ciudad!: string;
    descripcion!: string;
    numeroUsuarios!: number;
    usuarios!: any[];
    actividades?: any[]; // rutinas es un conjunto de rutinas, opcional
  }