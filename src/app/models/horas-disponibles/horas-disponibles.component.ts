import { Component } from '@angular/core';
import { Gimnasio } from '../gimnasio/gimnasio';


export class HorasDisponibles {

    id: number;
    horaInicio: string; // Opcional: puedes usar un tipo más específico si lo deseas
    horaFinal: string; // Opcional: puedes usar un tipo más específico si lo deseas
    gimnasio?: Gimnasio; // Suponiendo que ya tienes definida la interfaz Gimnasio

    constructor(
      id: number,
      horaInicio: Date,
      horaFinal: Date,
      gimnasio: Gimnasio, 
    ){
      this.id=id;
      this.horaInicio=horaInicio.toString();
      this.horaFinal=horaFinal.toString();
      this.gimnasio=gimnasio;
    }

}