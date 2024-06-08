import {  Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { RutinaService } from 'src/app/services/actividad.service';
import { ActivatedRoute } from '@angular/router';
import { GimnasioService } from 'src/app/services/gimnasio.service';
import { LoginService } from 'src/app/services/login.service';

import listPlugin from '@fullcalendar/list';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Gimnasio } from 'src/app/models/gimnasio/gimnasio';
import { Sala } from 'src/app/models/sala/sala/sala.component';
import Swal from 'sweetalert2';
import { Actividad } from 'src/app/models/actividad/Actividad';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit, OnChanges {
  @Input() idSalaSeleccionada!: number;
  idGimnasio!: number;
  eventos: any[] = [];
  actividades!: Actividad[];
  showConfirmationDialog: boolean = false;
  actividadId!: number;
  salas!: Sala[];
  rol: any;
  usuario!: any;

  constructor(private actividadService: RutinaService, private route: ActivatedRoute, private loginService: LoginService,
    private gimnasioService: GimnasioService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idGimnasio = +params['id'];
      this.obtenerSalas(this.idGimnasio);
    });

    this.obtenerUsuarioCompleto();

  }

  /**
   * Metodo que detecta el cambio de sala para mostrar las actividades de esa sala
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ID de la sala recibida en el calendario:', this.idSalaSeleccionada);

    if (changes['idSalaSeleccionada'] && !changes['idSalaSeleccionada'].firstChange) {
      this.obtenerActividades(this.idSalaSeleccionada);
    }
  }

  /**
   * Metodo que da valor al usuario actual y al rol
   */
  obtenerUsuarioCompleto() {
    this.loginService.getCurrentUser().subscribe(
      (user) => {
        this.usuario = user;
        this.rol = this.loginService.getUserRole();
      }
    )
  }

  /**
   * Metodo que da valor a las salas
   * @param idGimnasio 
   */
  obtenerSalas(idGimnasio: number) {
    this.gimnasioService.obtenerSalasPorGimnasio(idGimnasio).subscribe(
      (salas: Sala[]) => {
        this.salas = salas;
      },
      (error) => {
        console.log("Error al obtener las salas " + error)
      }
    )
  }

  /**
   * Metodo que da valor a las actividades y a los eventos del calendario
   * @param idSala 
   */
  obtenerActividades(idSala: number) {
    this.actividadService.verRutinas(idSala).subscribe(
      actividades => {
        this.actividades = actividades;
        this.eventos = actividades.map(actividad => ({
          title: actividad.nombre,
          start: actividad.horaInicio,
          end: actividad.horaFinal,
          id: actividad.id_actividad,
          display: null
        }));
        this.opcionesCalendario.events = this.eventos;
      },
      error => {
        console.log("Error al obtener las actividades")
      }
    );
  }

  /**
   * Creo un objeto de tipo CalendarOptions
   */
  opcionesCalendario: CalendarOptions = {
    initialView: 'timeGridWeek', // vista inicial
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin], // importo los plugins de las vistas
    eventClick: (info) => this.handleEventClick(info), // llama al evento handleEventClick cuando hago click en una actividad
    eventDrop: (arg) => this.handleEventDrop(arg),
    headerToolbar: { // manejo las vistas
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay,listWeek,dayGridMonth'
    },
    events: this.eventos, // los eventos es una lista de actividades formateada para que sea valida 
    droppable: true, // se puede editar en el calendario directamente
    locale: esLocale, // hora local
    editable: true, // permite arrastrar y editar eventos
    timeZone: 'UTC+0', // zona horaria
  };

  /**
   * metodo que se llama al clicar en una actividad, si es usuario registra o desregistra, sino se abre el dialogo para borrarlo
   * @param eventClickInfo 
   */
  handleEventClick(eventClickInfo: any) {
    this.actividadId = eventClickInfo.event.id;
    if (this.rol === "ROLE_USER") {
      this.usuarioRegistradoEnActividad(this.usuario.id, this.actividadId)
    } else {
      this.confirmBorrarRutina(this.actividadId);
    }

  }

  /**
   * Metodo que abre el dialogo para borrar la actividad, hace todas las validaciones necesarias
   * @param actividadId 
   */
  confirmBorrarRutina(actividadId: number) {
    this.actividadService.obtenerActividadPorId(actividadId).subscribe(
      (actividad) => {
        if (!actividad || !actividad.users || !Array.isArray(actividad.users)) {
          console.log("Datos de actividad no válidos: ", actividad);
          Swal.fire('Error', 'Error al verificar el propietario de la actividad. Por favor, inténtelo de nuevo.', 'error');
          return;
        }
        const esAdminDueño = this.rol === "ROLE_ADMIN" || this.rol === "ROLE_DUEÑO";
        const esEntrenadorOwner = this.rol === "ROLE_ENTRENADOR" && actividad.users.some(user => {
          return user.username === this.usuario.username;
        });
        if (esAdminDueño || esEntrenadorOwner) {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '250px',
            data: { message: '¿Quieres borrar la actividad?' },
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.borrarActividad(actividadId);
            }
          });
        } else {
          Swal.fire('Error', 'No eres el propietario de esta actividad', 'error');
        }
      },
      (error) => {
        console.log("Error al obtener la actividad: " + error);
        Swal.fire('Error', 'No eres el propietario de esta actividad', 'error');

      }
    );
  }

  cancelarBorrarRutina() {
    this.showConfirmationDialog = false;
  }

  /**
   * Metodo que registra o desregistra dependiendo si el usuario está ya registrado
   * @param usuarioId 
   * @param actividadId 
   */
  usuarioRegistradoEnActividad(usuarioId: number, actividadId: number) {
    // Verificar si el usuario está registrado en la actividad
    this.actividadService.verificarRegistroUsuarioEnActividad(usuarioId, actividadId).subscribe(
      registrado => {
        // Si está registrado, desregistrarlo
        if (registrado) {
          this.desregistrarUsuarioDeActividad(usuarioId, actividadId);

        } else {
          // Si no está registrado, registrarlo
          this.registrarUsuarioAActividad(usuarioId, actividadId);


        }
      },
      error => {
        console.error('Error al verificar el registro del usuario en la actividad:', error);
      }
    );
  }

  /**
   * Metodo para desregistrar a un usuario de la actividad
   * @param usuarioId 
   * @param actividadId 
   */
  desregistrarUsuarioDeActividad(usuarioId: number, actividadId: number) {
    this.actividadService.desregistrarUsuarioDeActividad(usuarioId, actividadId).subscribe(
      () => {
        console.log('Usuario desregistrado de la actividad correctamente');
        Swal.fire('Exito', 'Usuario desregistrado de la actividad correctamente', 'success').then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });

      },
      error => {
        console.error('Error al desregistrar usuario de la actividad:', error);
        Swal.fire('Error', 'Error al desregistrar usuario de la actividad:', 'error');

      }
    );
  }

  /**
   * Metodo que registra al usuario en la actividad
   * @param usuarioId 
   * @param actividadId 
   */
  registrarUsuarioAActividad(usuarioId: number, actividadId: number) {
    this.actividadService.agregarUsuarioAActividad(usuarioId, actividadId).subscribe(
      () => {
        console.log('Usuario agregado a la actividad correctamente');
        Swal.fire('Exito', 'Te has registrado a la actividad', 'success').then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });


      },
      error => {
        console.log('Error al agregar usuario a la actividad:', error);
        Swal.fire('Error', 'La actividad esta llena', 'error').then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });


      }
    );
  }


  /**
   * Metodo que se llama cuando se mueve una actividad, si cumple las validaciones se llama al servidor que la actualiza en la base de datos
   * @param eventDropInfo 
   * @returns 
   */
  handleEventDrop(eventDropInfo: any) {
    const event = eventDropInfo.event;
    const nuevaFechaInicio = new Date(event.start);
    const nuevaFechaFinal = new Date(event.end);
    const idActividad = event.id;
    let actividadActual = null;

    // Verificar la superposición con otras actividades
    const existeSuperposicion = this.actividades.some(actividad => {
      actividadActual = actividad;
      const fechaInicioExistente = new Date(actividad.horaInicio);
      const fechaFinalExistente = new Date(actividad.horaFinal);

      if (actividad.id_actividad == idActividad) {
        return false;
      }

      return (
        (nuevaFechaInicio < fechaFinalExistente && nuevaFechaFinal > fechaInicioExistente) ||
        (nuevaFechaFinal > fechaInicioExistente && nuevaFechaInicio < fechaFinalExistente) ||
        (nuevaFechaInicio >= fechaInicioExistente && nuevaFechaFinal <= fechaFinalExistente)
      );
    });

    if (existeSuperposicion) {
      console.log('Ya hay una actividad programada en este intervalo de tiempo.');
      eventDropInfo.revert();
      return;
    }

    // Actualizar la actividad con las nuevas fechas y horas
    const actividadActualizada: Actividad = {
      id_actividad: idActividad,
      nombre: event.title,
      descripcion: event.extendedProps.descripcion,
      horaInicio: nuevaFechaInicio.toISOString(),
      horaFinal: nuevaFechaFinal.toISOString(),
      capacidad: actividadActual!.capacidad,
      users: [],
      sala: {
        idSala: 0,
        nombre: '',
        actividades: [],
        gimnasio: new Gimnasio,
        horasDisponibles: []
      }
    };

    this.actividadService.obtenerActividadPorId(idActividad).subscribe(
      (actividad) => {
        const esAdminDueño = this.rol === "ROLE_ADMIN" || this.rol === "ROLE_DUEÑO";
        const esEntrenadorOwner = this.rol === "ROLE_ENTRENADOR" && actividad.users.some(user => {
          return user.username === this.usuario.username;
        });
        if (esAdminDueño || esEntrenadorOwner) {
          this.actualizarActividad(actividadActualizada, this.idSalaSeleccionada);
        } else {
          Swal.fire('Error', 'No tienes permisos para editar esta actividad', 'error');
          eventDropInfo.revert();
        }
      });

  }

  /**
   * Metodo que llama al servicio para actualizar la actividad
   * @param actividad 
   * @param salaId 
   */
  actualizarActividad(actividad: Actividad, salaId: number) {
    this.actividadService.actualizarActividad(actividad, salaId).subscribe(
      (actividadActualizada) => {

        console.log('Actividad actualizada:', actividadActualizada);
        location.reload()
      },
      error => {
        console.error('Error al actualizar la actividad:', error);
      }
    );
  }

  /**
   * Metodo que llama al servidor para borrar una actividad por id
   * @param id 
   */
  borrarActividad(id: number) {
    this.actividadService.borrarRutina(id).subscribe(
      () => {
        console.log('Actividad borrada exitosamente');
      },
      error => {
        console.error('Error al borrar la actividad:', error);
      }
    );
  }
}
