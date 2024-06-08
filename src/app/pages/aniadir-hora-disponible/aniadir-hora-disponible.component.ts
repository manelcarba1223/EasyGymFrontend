import { Component, Inject , OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA,  MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { HorasDisponibles } from 'src/app/models/horas-disponibles/horas-disponibles.component';
import { Sala } from 'src/app/models/sala/sala/sala.component';
import { GimnasioService } from 'src/app/services/gimnasio.service';
import { HorasDisponiblesService } from 'src/app/services/horas-disponibles.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aniadir-hora-disponible',
  templateUrl: './aniadir-hora-disponible.component.html',
  styleUrls: ['./aniadir-hora-disponible.component.css']
})
export class AniadirHoraDisponibleComponent implements OnInit {

  salas!: Sala[];
  horasDisponiblesForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AniadirHoraDisponibleComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { idGimnasio: number },
    private horasDisponiblesService: HorasDisponiblesService,
    private gimnasioService: GimnasioService,
    private loginService: LoginService 
  ) { }

  ngOnInit(): void {
    this.horasDisponiblesForm = this.fb.group({
      sala: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFinal: ['', Validators.required]
    });
    this.obtenerSalas(this.data.idGimnasio);
  }

  /**
   * Metodo que llama al servicio y da valor a las salas
   * @param idGimnasio 
   */
  obtenerSalas(idGimnasio: number): void {
    this.gimnasioService.obtenerSalasPorGimnasio(idGimnasio).subscribe(
      (salas: Sala[]) => {
        this.salas = salas;
      },
      (error) => {
        console.log("Error al obtener las salas " + error);
      }
    );
  }

  /**
   * Metodo que revisa si el usuario está registrado en el gimnasio
   * @returns un observable con true si esta registrado y false si no lo esta
   */
  usuarioRegistradoEnGimnasio(): Observable<boolean> {
    return this.gimnasioService.verGimnasioPorId(this.data.idGimnasio).pipe(
      map(gimnasio => gimnasio.usuarios.includes(this.loginService.getUser().username))
    );
  }

  /**
   * Metodo que crea una hora disponible
   */
  agregarHoras(): void {
    //si el formulario es valido
    if (this.horasDisponiblesForm.valid) {
      // si el usuario esta registrado en el gimnasio
      this.usuarioRegistradoEnGimnasio().subscribe(
        registrado => {
          if (registrado) {
            // crear la nueva hora disponible
            const newHoraDisponible: HorasDisponibles = {
              id: 0,
              horaInicio: this.horasDisponiblesForm.value.horaInicio + "+00:00",
              horaFinal: this.horasDisponiblesForm.value.horaFinal + "+00:00"
            };
            // llamar al service para agregar las horas a la sala
            this.horasDisponiblesService.agregarHorasDisponibles(this.horasDisponiblesForm.value.sala, newHoraDisponible)
              .subscribe(
                response => {
                  Swal.fire('Éxito', 'Hora disponible creada correctamente', 'success').then(() => {
                    this.dialogRef.close('Hora creada');
                  });
                },
                error => {
                  Swal.fire('Error', 'Error creando hora disponible, revisa las horas seleccionadas', 'error');
                  console.error('Error creando hora disponible:', error);
                }
              );
          } else {
            Swal.fire('Error', 'No eres el dueño del gimnasio', 'error');
          }
        },
        error => {
          Swal.fire('Error', 'Error al verificar el registro del usuario', 'error');
          console.error('Error al verificar el registro del usuario:', error);
        }
      );
    } else {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
    }
  }
}