import { User } from "../user/user";

export class Gimnasio {
    id_gimnasio!: number;
    nombre!: string;
    logo!: Uint8Array; 
    ciudad!: string;
    descripcion!: string;
    numeroUsuarios!: number;
    usuarios!: any[];
    actividades?: any[];
  }