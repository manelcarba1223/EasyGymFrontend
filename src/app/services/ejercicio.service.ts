import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroments';
import { Ejercicio } from '../models/ejercicio';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EjercicioService {

  constructor(private http: HttpClient) { }

  guardarEjercicio(ejercicio: Ejercicio): Observable<Ejercicio> {
    return this.http.post<Ejercicio>(`${environment.urlHost}ejercicio/crearEjercicio`, ejercicio);
  }

  verTodosLosEjercicios(): Observable<Ejercicio[]> {
    return this.http.get<Ejercicio[]>(`${environment.urlHost}ejercicio/ejercicios`);
  }

  agregarEjercicioARutina(rutinaId: number, ejercicioId: number): Observable<void> {
    const url = `${environment.urlHost}ejercicio/agregarEjercicioARutina?ejercicioId=${ejercicioId}&rutinaId=${rutinaId}`;
    return this.http.post<void>(url, null);
  }
}
