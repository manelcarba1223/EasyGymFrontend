import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, retry } from 'rxjs';
import { environment } from 'src/enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public loginStatusSubjec = new Subject<boolean>();

  constructor(private httpClient: HttpClient) { }

  //Llamamos al backend para generar el token
  public generateToken(loginData: any) {
    return this.httpClient.post(`${environment.urlHost}auth/login`, loginData)
  }

  //Iniciamos sesion y establecemos el token en el localstorage
  public loginUser(token: any) {
    localStorage.setItem('token', token);
  }

  //Devuelve true si está registrado y false si no 
  public isLoggedIn() {
    let tokenStr = localStorage.getItem('token');
    if (tokenStr == undefined || tokenStr == '' || tokenStr == null) {
      return false;
    }
    return true;
  }

  //Cerramos sesion y eliminamos el token del localstorage
  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  }

  //Obtener el token
  public getToken() {
    return localStorage.getItem('token');
  }

  public setUser(user: any){
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(){
    let userStr=localStorage.getItem('user');
    if (userStr == undefined || userStr == '' || userStr == null) {
      this.logout();
      return null;
    }
    return JSON.parse(userStr);
  }

  public getUserRole() {
    let user = this.getUser();
    return user.authorities[0].authority;
  }

  public getCurrentUser(){
    return this.httpClient.get(`${environment.urlHost}auth/actual-usuario`);
  }
}
