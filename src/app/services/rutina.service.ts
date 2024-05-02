import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actividad } from '../models/Actividad';
import { environment } from 'src/enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class RutinaService {

  constructor(private httpClient: HttpClient) { }

  // Ver rutinas por id del gimnasio
  public verRutinas(id: number): Observable<Actividad[]>{
    return this.httpClient.get<Actividad[]>(`${environment.urlHost}rutina/rutinas/${id}`);
  }

   // Obtener actividad por ID
   public obtenerActividadPorId(id: number): Observable<Actividad> {
    return this.httpClient.get<Actividad>(`${environment.urlHost}rutina/${id}`);
  }

  //Crear rutina
  public crearActividad(idGimnasio: number, rutina: Actividad){
    return this.httpClient.post<Actividad>(`${environment.urlHost}rutina/crearRutinaEnGimnasio/${idGimnasio}`, rutina);
  }

  // Actualizar actividad
  public actualizarActividad(actividad: Actividad): Observable<Actividad> {
    return this.httpClient.put<Actividad>(`${environment.urlHost}rutina/actualizarRutina/${actividad.id_actividad}`, actividad);
  }

  // Agregar usuario a actividad
  agregarUsuarioAActividad(usuarioId: number, actividadId: number): Observable<void> {
    const url = `${environment.urlHost}rutina/agregarUsuarioAActividad`;
    const params = { usuarioId: usuarioId.toString(), actividadId: actividadId.toString() };
    return this.httpClient.post<void>(url, null, { params });
  }

  desregistrarUsuarioDeActividad(usuarioId: number, actividadId: number): Observable<void> {
    const url = `${environment.urlHost}rutina/desregistrarUsuarioDeActividad?usuarioId=${usuarioId}&actividadId=${actividadId}`;
    return this.httpClient.delete<void>(url);
  }

  verificarRegistroUsuarioEnActividad(usuarioId: number, actividadId: number): Observable<boolean> {
    const url = `${environment.urlHost}rutina/verificarRegistroUsuarioEnActividad?usuarioId=${usuarioId}&actividadId=${actividadId}`;
    return this.httpClient.get<boolean>(url);
  }

  // Borrar rutina por ID
  public borrarRutina(id: number): Observable<void> {
    const url = `${environment.urlHost}rutina/borrarRutina/${id}`;
    return this.httpClient.delete<void>(url);
  }
}
