import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/enviroments/enviroments';
import { Actividad } from '../models/actividad/Actividad';

@Injectable({
  providedIn: 'root'
})
export class RutinaService {

  constructor(private httpClient: HttpClient) { }

  // Ver rutinas por id del gimnasio
  public verRutinas(id: number): Observable<Actividad[]>{
    return this.httpClient.get<Actividad[]>(`${environment.urlHost}actividad/actividades/${id}`);
  }

   // Obtener actividad por ID
   public obtenerActividadPorId(id: number): Observable<Actividad> {
    return this.httpClient.get<Actividad>(`${environment.urlHost}actividad/${id}`);
  }

  // Ver actividades por ID de la sala
  public obtenerActividadesPorSalaId(idSala: number): Observable<Actividad[]> {
    const url = `${environment.urlHost}actividad/actividades/${idSala}`;
    return this.httpClient.get<Actividad[]>(url);
  }

  //Crear actividad
  public crearActividad(idSala: number, actividad: Actividad){
    return this.httpClient.post<Actividad>(`${environment.urlHost}actividad/crearActividadEnSala/${idSala}`, actividad);
  }

  // Actualizar actividad
  public actualizarActividad(actividad: Actividad, salaId: number): Observable<Actividad> {
    return this.httpClient.put<Actividad>(`${environment.urlHost}actividad/actualizarActividad/${actividad.id_actividad}/${salaId}`, actividad);
  }

  // Agregar usuario a actividad
  agregarUsuarioAActividad(usuarioId: number, actividadId: number): Observable<void> {
    const url = `${environment.urlHost}actividad/agregarUsuarioAActividad`;
    const params = { usuarioId: usuarioId.toString(), actividadId: actividadId.toString() };
    return this.httpClient.post<void>(url, null, { params }).pipe(
      catchError(error => {
        return throwError(error); // Devuelve el error al componente
      })
    );;
  }

  desregistrarUsuarioDeActividad(usuarioId: number, actividadId: number): Observable<void> {
    const url = `${environment.urlHost}actividad/desregistrarUsuarioDeActividad?usuarioId=${usuarioId}&actividadId=${actividadId}`;
    return this.httpClient.delete<void>(url);
  }

  verificarRegistroUsuarioEnActividad(usuarioId: number, actividadId: number): Observable<boolean> {
    const url = `${environment.urlHost}actividad/verificarRegistroUsuarioEnActividad?usuarioId=${usuarioId}&actividadId=${actividadId}`;
    return this.httpClient.get<boolean>(url);
  }

  
  public borrarRutina(id: number): Observable<void> {
    const url = `${environment.urlHost}actividad/borrarActividad/${id}`;
    return this.httpClient.delete<void>(url);
  }
}
