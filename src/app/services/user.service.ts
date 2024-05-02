import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroments';
import { User } from '../models/user/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http: any;

  constructor(private httpClient: HttpClient) { }

  public añadirUsuario(user: any){
    return this.httpClient.post(`${environment.urlHost}auth/register`, user);
  }

  obtenerUsuarioPorUsername(username: string): Observable<User> {
    return this.httpClient.get<User>(`${environment.urlHost}usuario/${username}`);
  }
}
