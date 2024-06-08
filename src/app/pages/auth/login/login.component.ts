import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;

  constructor(private router: Router, private formBuilder: FormBuilder, private loginService: LoginService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginSubmit() {
    this.loginService.generateToken(this.loginForm.value).subscribe(
      (data: any) => {
        console.log(data);
        Swal.fire('¡Éxito!', 'Inicio de sesión exitoso', 'success').then(() => {
          this.loginService.loginUser(data.token);
          this.loginService.getCurrentUser().subscribe((user: any) => {
            this.loginService.setUser(user);
            console.log(user);
            this.router.navigate(['']);
          });
        });
      }, (error: any) => {
        console.log(error);
        Swal.fire('Error', 'Error al iniciar sesión. Por favor, verifica tus credenciales.', 'error');
      }
    );
  }
}