import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HorasDisponibles } from '../models/horas-disponibles/horas-disponibles.component';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class HorasDisponiblesService {

  constructor(private httpClient: HttpClient) { }

  public agregarHorasDisponibles(idSala: number, horas: HorasDisponibles): Observable<void> {
    return this.httpClient.post<void>(`${environment.urlHost}salas/${idSala}/agregar-horas`, horas);
  }

  public devolverHorasDisponibles(idSala: number): any {
    return this.httpClient.get<any>(`${environment.urlHost}salas/${idSala}/horas-disponibles`);
  }

}
