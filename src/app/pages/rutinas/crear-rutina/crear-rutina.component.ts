import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Actividad } from 'src/app/models/Actividad';
import { HorasDisponibles } from 'src/app/models/horas-disponibles/horas-disponibles.component';
import { User } from 'src/app/models/user/user';
import { HorasDisponiblesService } from 'src/app/services/horas-disponibles.service';
import { LoginService } from 'src/app/services/login.service';
import { RutinaService } from 'src/app/services/rutina.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-crear-rutina',
  templateUrl: './crear-rutina.component.html',
  styleUrls: ['./crear-rutina.component.css']
})
export class CrearRutinaComponent {

  usuario!: any;
  actividadForm!: FormGroup;
  idGimnasio!: number;
  idActividad!: number;
  actividades!: Actividad[];
  horasDisponibles!: HorasDisponibles[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearRutinaComponent>, // Referencia al diálogo actual
    @Inject(MAT_DIALOG_DATA) private data: { idGimnasio: number }, // Recibe el idGimnasio
    private actividadService: RutinaService,
    private userService: UserService,
    private loginService: LoginService,
    private horasDisponiblesService: HorasDisponiblesService,
  ) { }


  ngOnInit(): void {
    this.idGimnasio = this.data.idGimnasio; // Obtiene el idGimnasio del MAT_DIALOG_DATA
    this.initForm();
    this.usuario = this.loginService.getUser();
    this.obtenerActividades(this.idGimnasio);
    this.obtenerHorasDisponibles(this.idGimnasio);
  }

  obtenerActividades(idGimnasio: number) {
    this.actividadService.verRutinas(idGimnasio).subscribe(
      (actividades) => {
        this.actividades = actividades;
      }
    )
  }

  obtenerHorasDisponibles(idGimnasio: number) {
    this.horasDisponiblesService.devolverHorasDisponibles(idGimnasio).subscribe(
      (horas: HorasDisponibles[]) => {
        const fechaActual = new Date();
        //const fechaActualUTC = this.convertirAFechaUTC(fechaActual); // Convertir la fecha actual a UTC
        this.horasDisponibles = horas.filter(hora => {
          // Parsea las fechas de inicio y final de la hora disponible y las convierte a UTC
          const fechaInicio = this.convertirAFechaUTC(new Date(hora.horaInicio));
          // Comparar si la fecha actual en UTC es posterior o igual a la fecha de inicio en UTC
          return fechaActual <= fechaInicio;
        });
      },
      (error: string) => {
        console.log("Error al ver las horas disponibles " + error)
      }
    );
  }

  formatearFecha(fechaString: string): string {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('UTC', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  }

  agregarUsuarioAActividad(usuarioId: number, actividadId: number) {
    this.actividadService.agregarUsuarioAActividad(usuarioId, actividadId).subscribe(
      () => {
        console.log('Usuario agregado a la actividad correctamente');
      },
      error => {
        alert(error)
        console.error('Error al agregar usuario a la actividad:', error);
      }
    );
  }

  initForm(): void {
    this.actividadForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      horaInicio: ['', Validators.required],
      horaFinal: ['', Validators.required],
      capacidad: ['', Validators.required]
    });
  }

  crearActividad(idGimnasio: number): void {
    const nuevaActividad: Actividad = {
      id_actividad: 0, // Esto será ignorado ya que la generación de ID se hace en el servidor
      nombre: this.actividadForm.value.nombre,
      descripcion: this.actividadForm.value.descripcion,
      // Ajusta la conversión de cadena de texto a objeto Date agregando dos horas
      horaInicio: this.actividadForm.value.horaInicio+"+00:00"
      ,
      horaFinal: this.actividadForm.value.horaFinal+"+00:00"
      ,
      capacidad: this.actividadForm.value.capacidad,

      users: []
    };
    console.log(nuevaActividad)

    // Verificar si hay alguna actividad existente en el mismo intervalo de tiempo
    const existeSuperposicion = this.actividades.some(actividad => {
      return (
        // Verificar si la nueva actividad comienza antes de que comience una actividad existente
        (nuevaActividad.horaInicio >= actividad.horaInicio && nuevaActividad.horaInicio < actividad.horaFinal) ||
        // Verificar si la nueva actividad termina después de que comienza una actividad existente
        (nuevaActividad.horaFinal > actividad.horaInicio && nuevaActividad.horaFinal <= actividad.horaFinal) ||
        // Verificar si la nueva actividad cubre completamente una actividad existente
        (nuevaActividad.horaInicio <= actividad.horaInicio && nuevaActividad.horaFinal >= actividad.horaFinal)
      );
    });

    console.log(existeSuperposicion)
    if (existeSuperposicion) {
      console.log('Ya hay una actividad programada en este intervalo de tiempo.');
      return; // Salir del método sin crear la nueva actividad
    }

    // Si no hay superposición, proceder a crear la nueva actividad
    this.actividadService.crearActividad(idGimnasio, nuevaActividad)
      .subscribe(
        nuevaActividad => {
          this.idActividad = nuevaActividad.id_actividad;
          console.log('Actividad creada:', nuevaActividad);
          console.log('ID de la actividad:', this.idActividad);
          location.reload();


          // Llamar a agregarUsuarioAActividad después de obtener el ID de la actividad
          this.agregarUsuarioAActividad(this.usuario.id, this.idActividad);
          //location.reload();
        },
        error => {
          console.log(error);
          alert(error)

          alert('Error al crear la actividad');
        }
      );
  }

  convertirAFechaUTC(fecha: Date): Date {
    const utcDate = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000); // Ajustar la fecha a la zona horaria local
    return utcDate;
  }

  submitForm() {
    this.crearActividad(this.idGimnasio);
    alert(this.idActividad)

  }

  cancelar(): void {
    this.dialogRef.close(); // Cierra el diálogo sin hacer nada
  }
}