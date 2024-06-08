import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sala } from '../models/sala/sala/sala.component';
import { environment } from 'src/enviroments/enviroments';
import { HorasDisponibles } from '../models/horas-disponibles/horas-disponibles.component';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  constructor(private httpClient: HttpClient) { }

  public guardarSala(sala: Sala): Observable<Sala> {
    return this.httpClient.post<Sala>(`${environment.urlHost}salas`, sala);
  }

  public guardarSalaEnGimnasio(idGimnasio: number, sala: Sala): Observable<Sala> {
    return this.httpClient.post<Sala>(`${environment.urlHost}salas/${idGimnasio}/guardarSala`, sala);
  }

  public obtenerSalaPorId(id: number): Observable<Sala> {
    return this.httpClient.get<Sala>(`${environment.urlHost}salas/${id}`);
  }

  public obtenerTodasLasSalas(): Observable<Sala[]> {
    return this.httpClient.get<Sala[]>(`${environment.urlHost}salas`);
  }

  public actualizarSala(id: number, salaActualizada: Sala): Observable<Sala> {
    return this.httpClient.put<Sala>(`${environment.urlHost}salas/${id}`, salaActualizada);
  }

  public eliminarSalaPorId(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.urlHost}salas/${id}`);
  }

  public agregarHorasDisponibles(idSala: number, horas: HorasDisponibles): Observable<void> {
    return this.httpClient.post<void>(`${environment.urlHost}salas/${idSala}/horasdisponibles`, horas);
  }

  public devolverHorasDisponiblesPorId(idSala: number): Observable<HorasDisponibles[]> {
    return this.httpClient.get<HorasDisponibles[]>(`${environment.urlHost}salas/${idSala}/horasdisponibles`);
  }
}