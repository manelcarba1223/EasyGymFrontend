import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  userForm: FormGroup;
  hide = true;
  roles: string[] = ['DUEÑO', 'USER', 'ENTRENADOR']; 
  
  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(30)]],
      name: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(80)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      birth_date: ['', [Validators.required]],
      roles: [[]] 
    });
  }

  formSubmit() {
    if (this.userForm.valid) {
      const birthDate = new Date(this.userForm.value.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 16) {
        Swal.fire('Error', 'Debes tener al menos 16 años para registrarte', 'error');
        return;
      }
      this.userService.añadirUsuario(this.userForm.value).subscribe(
        (data) => {
          Swal.fire('Éxito', 'Usuario creado con éxito', 'success').then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        }, (error) => {
          Swal.fire('Error', 'Error al crear el usuario', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
    }
  }
}