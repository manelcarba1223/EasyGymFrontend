import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroments';
import { Gimnasio } from '../models/gimnasio/gimnasio';
import { Sala } from '../models/sala/sala/sala.component';

@Injectable({
  providedIn: 'root'
})
export class GimnasioService {


  constructor(private httpClient: HttpClient) { }

  //Mostrar todos los gimnasios
  public verGimnasios(): Observable<Gimnasio[]> {
    return this.httpClient.get<Gimnasio[]>(`${environment.urlHost}gimnasio/gimnasios`);
  }

  //Eliminar gimnasio
  eliminarGimnasio(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.urlHost}gimnasio/gimnasios/${id}`);
  }

  //Crear gimnasio
  crearGimnasio(gimnasioData: any) {
    return this.httpClient.post<Gimnasio>(`${environment.urlHost}gimnasio/crearGimnasio`, gimnasioData);
  }

  //Editar gimnasio
  editarGimnasio(id: number, gimnasioData: any) {
    return this.httpClient.put<void>(`${environment.urlHost}gimnasio/actualizarGimnasio/${id}`, gimnasioData);
  }

  //Ver por id
  verGimnasioPorId(id: number) {
    return this.httpClient.get<Gimnasio>(`${environment.urlHost}gimnasio/verGimnasio/${id}`);
  }

  verGimnasioPorNombre(nombre: string) {
    return this.httpClient.get<Gimnasio>(`${environment.urlHost}gimnasio/verGimnasioNombre/${nombre}`);
  }

  //Registrar usuario en gimnasio
  registrarUsuarioEnGimnasio(gimnasioId: number, usuarioId: number): Observable<void> {
    const url = `${environment.urlHost}gimnasio/agregarUsuarioAGimnasio?gimnasioId=${gimnasioId}&usuarioId=${usuarioId}`;
    return this.httpClient.post<void>(url, null);
  }

  cargarLogoGimnasio(id: number, file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('logo', file, file.name);

    return this.httpClient.post(`${environment.urlHost}gimnasio/${id}/logo`, formData, { responseType: 'text' });
  }

  // Obtener logo de gimnasio
  obtenerLogoGimnasio(id: number): Observable<any> {
    return this.httpClient.get(`${environment.urlHost}gimnasio/${id}/logo`, { responseType: 'blob' });
  }

  obtenerSalasPorGimnasio(idGimnasio: number): Observable<Sala[]> {
    return this.httpClient.get<Sala[]>(`${environment.urlHost}gimnasio/${idGimnasio}/ver-salas`);
  }
}
