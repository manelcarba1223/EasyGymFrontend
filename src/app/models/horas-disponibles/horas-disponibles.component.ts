import { Component } from '@angular/core';
import { Gimnasio } from '../gimnasio/gimnasio';


export class HorasDisponibles {

    id: number;
    horaInicio: string; 
    horaFinal: string; 
    gimnasio?: Gimnasio;

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