import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  userForm: FormGroup;
  hide= true;
  roles: string[] = ['ADMIN', 'USER', 'ENTRENADOR']; // Define los roles disponibles


  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(30)]],
      name: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(80)]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      birth_date: ['', [Validators.required]],
      roles: [[]] // Inicializa el campo de roles como un array vacío
    });
  }


  formSubmit() {
    // Aquí envías los roles al backend
    console.log("Roles seleccionados:", this.userForm.value.roles);
    this.userService.añadirUsuario(this.userForm.value).subscribe(
      (data) => {
        console.log(data);
        alert("Usuario creado con éxito");
      }, (error) => {
        console.log(error);
        alert("Error al crear el usuario");
      }
    );
  }
}