import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { Gimnasio } from 'src/app/models/gimnasio/gimnasio';
import { Sala } from 'src/app/models/sala/sala/sala.component';
import { GimnasioService } from 'src/app/services/gimnasio.service';
import { LoginService } from 'src/app/services/login.service';
import { SalaService } from 'src/app/services/sala.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-sala',
  templateUrl: './crear-sala.component.html',
  styleUrls: ['./crear-sala.component.css']
})
export class CrearSalaComponent implements OnInit {

  salaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private salaService: SalaService,
    private gimnasioService: GimnasioService,
    private loginService: LoginService,
    @Inject(MAT_DIALOG_DATA) public data: { idGimnasio: number },
    private dialogRef: MatDialogRef<CrearSalaComponent>
  ) { }

  ngOnInit(): void {
    this.salaForm = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  /**
   * Verifica si el usuario está registrado en el gimnasio
   * @returns 
   */
  usuarioRegistradoEnGimnasio(): Observable<boolean> {
    const usuario = this.loginService.getUser();
    return this.gimnasioService.verGimnasioPorId(this.data.idGimnasio).pipe(
      map(gimnasio => gimnasio.usuarios.includes(usuario.username))
    );
  }

  /**
   * Metodo para crear la sala
   * @returns 
   */
  guardarSala(): void {
    if (this.salaForm.invalid) {
      return;
    }

    this.usuarioRegistradoEnGimnasio().subscribe(
      registrado => {
            // Si el usuario es´ta registrado 
        if (registrado) {
          const nuevaSala: Sala = {
            nombre: this.salaForm.value.nombre,
            idSala: 0,
            actividades: [],
            gimnasio: new Gimnasio(),
            horasDisponibles: []
          };

          this.salaService.guardarSalaEnGimnasio(this.data.idGimnasio, nuevaSala)
            .subscribe(
              res => {
                Swal.fire('Éxito', 'Sala guardada exitosamente', 'success').then(() => {
                  this.dialogRef.close(res);
                  location.reload();
                });
                
              },
              error => {
                Swal.fire('Error', 'Error al guardar la sala', 'error');
                console.error('Error al guardar la sala:', error);
              }
            );
        } else {
          Swal.fire('Error', 'No eres el dueño de este gimnasio', 'error');
        }
      },
      error => {
        Swal.fire('Error', 'Error al verificar el registro del usuario', 'error');
        console.error('Error al verificar el registro del usuario:', error);
      }
    );
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}