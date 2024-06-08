import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { HorasDisponibles } from 'src/app/models/horas-disponibles/horas-disponibles.component';
import { Sala } from 'src/app/models/sala/sala/sala.component';
import { User } from 'src/app/models/user/user';
import { GimnasioService } from 'src/app/services/gimnasio.service';
import { HorasDisponiblesService } from 'src/app/services/horas-disponibles.service';
import { LoginService } from 'src/app/services/login.service';
import { RutinaService } from 'src/app/services/actividad.service';
import { SalaService } from 'src/app/services/sala.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { Actividad } from 'src/app/models/actividad/Actividad';

@Component({
  selector: 'app-crear-rutina',
  templateUrl: './crear-actividad.component.html',
  styleUrls: ['./crear-actividad.component.css']
})
export class CrearRutinaComponent implements OnInit {

  usuario!: User;
  actividadForm!: FormGroup;
  idGimnasio!: number;
  idActividad!: number;
  actividades!: Actividad[];
  horasDisponibles!: HorasDisponibles[];
  salas!: Sala[];
  rol!: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearRutinaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { idGimnasio: number },
    private actividadService: RutinaService,
    private userService: UserService,
    private loginService: LoginService,
    private horasDisponiblesService: HorasDisponiblesService,
    private salaService: SalaService,
    private gimnasioService: GimnasioService
  ) { }

  ngOnInit(): void {
    this.idGimnasio = this.data.idGimnasio;
    this.initForm();
    this.usuario = this.loginService.getUser();
    this.obtenerSalas(this.idGimnasio);
  }

  /**
   * 
   * @returns 
   */
  usuarioRegistradoEnGimnasio(): Observable<boolean> {
    return this.gimnasioService.verGimnasioPorId(this.idGimnasio).pipe(
      map(gimnasio => gimnasio.usuarios.includes(this.usuario.username))
    );
  }

  /**
   * Metodo que obtiene las horas disponibles y las actividades de las salas de un gimnasio
   * @param idGimnasio 
   */
  obtenerSalas(idGimnasio: number): void {
    this.gimnasioService.obtenerSalasPorGimnasio(idGimnasio).subscribe(
      (salas) => {
        this.salas = salas;
        if (this.salas.length > 0) {
          this.actividadForm.patchValue({ sala: this.salas[0].idSala });
          this.obtenerHorasDisponibles(this.salas[0].idSala);
          this.obtenerActividades(this.salas[0].idSala);
          console.log(this.horasDisponibles)
        }
      },
      (error) => {
        Swal.fire('Error', 'Error al obtener las salas', 'error');
      }
    );
  }

  obtenerActividades(idSala: number): void {
    this.actividadService.obtenerActividadesPorSalaId(idSala).subscribe(
      (actividades) => {
        this.actividades = actividades;
      },
      (error) => {
        Swal.fire('Error', 'Error al obtener las actividades', 'error');
      }
    );
  }

  /**
   * Metodo que obtiene las horas disponibles de una sala
   * @param idSala 
   */
  obtenerHorasDisponibles(idSala: number): void {
    this.horasDisponiblesService.devolverHorasDisponibles(idSala).subscribe(
      (horas: HorasDisponibles[]) => {
        this.horasDisponibles = horas
      },
      () => {
        Swal.fire('Error', 'Error al obtener las horas disponibles', 'error');
      }
    );
  }

  /**
   * Metodo que se llama cuando se selecciona una nueva sala y da los valores de las horas disponibles y las actividades de esa sala
   * @param event 
   */
  seleccionarSala(event: any): void {
    const idSalaSeleccionada = parseInt(event.target.value);
    this.obtenerHorasDisponibles(idSalaSeleccionada);
    this.obtenerActividades(idSalaSeleccionada);
  }


  /**
   * Metodo que registra a un usuario en una actividad
   * @param usuarioId 
   * @param actividadId 
   */
  agregarUsuarioAActividad(usuarioId: number, actividadId: number): void {
    this.actividadService.agregarUsuarioAActividad(usuarioId, actividadId).subscribe(
      () => {
        Swal.fire('Éxito', 'Usuario agregado a la actividad correctamente', 'success');
        location.reload();

      },
      (error) => {
        Swal.fire('Error', 'Error al agregar usuario a la actividad', 'error');
      }
    );
  }

  initForm(): void {
    this.actividadForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      horaInicio: ['', Validators.required],
      horaFinal: ['', Validators.required],
      capacidad: ['', Validators.required],
      sala: ['', Validators.required]
    });
  }

  /**
   * Metodo que crea la actividad
   * @returns 
   */
  crearActividad(): void {
    const salaSeleccionada = this.actividadForm.value.sala;
    const nuevaActividad: Actividad = {
      id_actividad: 0,
      nombre: this.actividadForm.value.nombre,
      descripcion: this.actividadForm.value.descripcion,
      horaInicio: this.actividadForm.value.horaInicio + "+00:00",
      horaFinal: this.actividadForm.value.horaFinal + "+00:00",
      capacidad: this.actividadForm.value.capacidad + 1,
      users: [],
      sala: salaSeleccionada
    };

    // Compruebo si ya hay una actividad en ese intervalo de tiempo
    const existeSuperposicion = this.actividades.some(actividad => {
      return (
        (nuevaActividad.horaInicio >= actividad.horaInicio && nuevaActividad.horaInicio < actividad.horaFinal) ||
        (nuevaActividad.horaFinal > actividad.horaInicio && nuevaActividad.horaFinal <= actividad.horaFinal) ||
        (nuevaActividad.horaInicio <= actividad.horaInicio && nuevaActividad.horaFinal >= actividad.horaFinal)
      );
    });

    if (existeSuperposicion) {
      Swal.fire('Error', 'Ya hay una actividad programada en este intervalo de tiempo.', 'error');
      return;
    }

    this.actividadService.crearActividad(salaSeleccionada, nuevaActividad).subscribe(
      nuevaActividad => {
        this.idActividad = nuevaActividad.id_actividad;
        Swal.fire('Éxito', 'Actividad creada correctamente', 'success').then(() => {
          this.agregarUsuarioAActividad(this.usuario.id, this.idActividad);
          this.dialogRef.close();
        });
      },
      (error) => {
        Swal.fire('Error', 'Error al crear la actividad, revisa los datos de tu formulario y las horas disponibles de la sala', 'error');
      }
    );
  }

  convertirAFechaUTC(fecha: Date): Date {
    const utcDate = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000);
    return utcDate;
  }

  submitForm(): void {
    this.usuarioRegistradoEnGimnasio().subscribe(
      (registrado) => {
        if (registrado) {
          this.crearActividad();
        } else {
          Swal.fire('Error', 'No estás registrado en el gimnasio.', 'error');
        }
      },
      (error) => {
        Swal.fire('Error', 'Error al verificar el registro del usuario.', 'error');
      }
    );
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}