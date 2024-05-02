import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginService } from "../services/login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private loginService: LoginService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authRequest = req;
        const token = this.loginService.getToken();
        if(token != null){
            authRequest = authRequest.clone({
                setHeaders : {Authorization : 'Bearer '+token}
            })
        }
        return next.handle(authRequest);
    }
} 

export const authInterceptorProviders = [
{
    provide : HTTP_INTERCEPTORS, // que hacemos
    useClass : AuthInterceptor, // que clase usamos
    multi : true // para añadir la cantidad de interceptores que queramos
}
]