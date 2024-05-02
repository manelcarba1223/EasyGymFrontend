import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;

  constructor(private router: Router,private formBuilder: FormBuilder, private loginService: LoginService) {
    this.loginForm = this.formBuilder.group({
      username: ['Admin', Validators.required],
      password: ['123456', Validators.required]
    });
  }

  loginSubmit() {
    this.loginService.generateToken(this.loginForm.value).subscribe(
      (data: any) => {
        console.log(data);
        alert("Inicio de sesión exitoso");
        this.loginService.loginUser(data.token);
        this.loginService.getCurrentUser().subscribe((user: any) => {
          this.loginService.setUser(user);
          console.log(user);

          if(this.loginService.getUserRole() == "ROLE_ADMIN"){
            console.log("ERES ADMIN"); //llevar a la pantalla admin
            this.loginService.loginStatusSubjec.next(true);
            this.router.navigate(['']);

          }

          if(this.loginService.getUserRole() == "ROLE_USER"){
            console.log("ERES USER"); //llevar a la pantalla admin
            this.router.navigate(['']);
          }

          if(this.loginService.getUserRole() == "ROLE_ENTRENADOR"){
            console.log("ERES ENTRENADOR"); //llevar a la pantalla admin
            this.router.navigate(['']);
          }
        });

        // Redireccionar o realizar alguna acción después del inicio de sesión
      }, (error: any) => {
        console.log(error);
        alert("Error al iniciar sesión");
      }
    );

  }
}