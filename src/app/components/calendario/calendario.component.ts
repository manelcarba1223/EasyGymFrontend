import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'
import { RutinaService } from 'src/app/services/rutina.service';
import { ActivatedRoute } from '@angular/router';
import { GimnasioService } from 'src/app/services/gimnasio.service';
import { Actividad } from 'src/app/models/Actividad';
import { UserService } from 'src/app/services/user.service';
import { LoginService } from 'src/app/services/login.service';
import { Calendar } from '@fullcalendar/core';

import listPlugin from '@fullcalendar/list'
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  idGimnasio!: number;
  eventos: any[] = [];
  actividades!: Actividad[];
  showConfirmationDialog: boolean = false;
  actividadId!: number;

  constructor(private changeDetectorRef: ChangeDetectorRef, private actividadService: RutinaService, private route: ActivatedRoute, private loginService: LoginService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idGimnasio = +params['id'];
      this.obtenerActividades(this.idGimnasio);
    });
  }

  obtenerActividades(idGimnasio: number) {
    this.actividadService.verRutinas(idGimnasio).subscribe(
      actividades => {
        this.actividades = actividades;
        this.eventos = actividades.map(actividad => ({
          title: actividad.nombre,
          start: actividad.horaInicio,
          end: actividad.horaFinal,
          id: actividad.id_actividad,
          display: null
        }));
        this.calendarOptions.events = this.eventos;
      },
      error => {
        console.log("Error al obtener las actividades")
      }
    );
  }


  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    eventClick: (info) => this.handleEventClick(info),
    eventDrop: (arg) => this.handleEventDrop(arg),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay,listWeek,dayGridMonth'
    },
    events: this.eventos,
    droppable: true,
    locale: esLocale,
    editable: true, // Permite arrastrar y editar eventos
    timeZone: 'UTC+0',
    businessHours: { // Establece las horas de negocio de lunes a viernes de 9am a 5pm
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // Lunes a viernes
      startTime: '09:00', // 9am
      endTime: '17:00' // 5pm
    }
  };
  handleEventClick(eventClickInfo: any) {
    // Obtener el ID de la actividad
    this.actividadId = eventClickInfo.event.id;
    const usuarioId = this.loginService.getUser().id;
    const userRole = this.loginService.getUserRole();

    if (userRole === 'ROLE_ENTRENADOR' || userRole === 'ROLE_ADMIN') {
      // Si el usuario es un entrenador, mostrar el diálogo de confirmación para borrar la rutina
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px',
        data: { message: '¿Quieres borrar la actividad?' },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Si el usuario confirma, borrar la rutina
          this.borrarRutina(this.actividadId);
        }
      });
    } else {
      // Verificar si el usuario está registrado en la actividad
      this.usuarioRegistradoEnActividad(usuarioId, this.actividadId);
    }
  }


  confirmBorrarRutina(actividadId: number) {
    this.borrarRutina(actividadId);
    this.showConfirmationDialog = false; // Ocultar el diálogo después de confirmar
    location.reload();
  }

  cancelarBorrarRutina() {
    this.showConfirmationDialog = false; // Ocultar el diálogo si se cancela
  }

  usuarioRegistradoEnActividad(usuarioId: number, actividadId: number) {
    // Verificar si el usuario está registrado en la actividad
    this.actividadService.verificarRegistroUsuarioEnActividad(usuarioId, actividadId).subscribe(
      registrado => {
        // Si está registrado, desregistrarlo
        if (registrado) {
          alert("Te has ido de la actividad");
          this.desregistrarUsuarioDeActividad(usuarioId, actividadId);
        } else {
          // Si no está registrado, registrarlo
          this.registrarUsuarioAActividad(usuarioId, actividadId);
        }
      },
      error => {
        console.error('Error al verificar el registro del usuario en la actividad:', error);
        // Manejar el error según sea necesario
      }
    );
  }

  desregistrarUsuarioDeActividad(usuarioId: number, actividadId: number) {
    this.actividadService.desregistrarUsuarioDeActividad(usuarioId, actividadId).subscribe(
      () => {
        console.log('Usuario desregistrado de la actividad correctamente');
        // Realizar cualquier otra acción necesaria después de desregistrar al usuario de la actividad
      },
      error => {
        console.error('Error al desregistrar usuario de la actividad:', error);
        // Manejar el error según sea necesario
      }
    );
  }

  registrarUsuarioAActividad(usuarioId: number, actividadId: number) {
    // Simplemente llamando al servicio para agregar usuario a la actividad
    // Debes implementar la lógica de este método en tu servicio RutinaService
    this.actividadService.agregarUsuarioAActividad(usuarioId, actividadId).subscribe(
      () => {
        console.log('Usuario agregado a la actividad correctamente');
        alert("Te has registrado a la actividad");
      },
      error => {
        console.error('Error al agregar usuario a la actividad:', error);
        alert("No puedes registrarte en la actividad porque la actividad está llena")
      }
    );
  }

  // Función para convertir tiempo UNIX a una cadena de fecha y hora legible
  convertirTiempoUnixAFecha(tiempoUnix: number): string {
    // Crea un objeto Date con el tiempo UNIX proporcionado
    const fecha = new Date(tiempoUnix * 1000); // Multiplica por 1000 para convertir de segundos a milisegundos

    // Obtiene los componentes de la fecha y hora
    const año = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Agrega un cero inicial y toma los últimos dos dígitos
    const dia = ('0' + fecha.getDate()).slice(-2); // Agrega un cero inicial y toma los últimos dos dígitos
    const horas = ('0' + fecha.getHours()).slice(-2); // Agrega un cero inicial y toma los últimos dos dígitos
    const minutos = ('0' + fecha.getMinutes()).slice(-2); // Agrega un cero inicial y toma los últimos dos dígitos
    const segundos = ('0' + fecha.getSeconds()).slice(-2); // Agrega un cero inicial y toma los últimos dos dígitos

    // Retorna la cadena de fecha y hora legible
    return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  }

  handleEventDrop(eventDropInfo: any) {
    const event = eventDropInfo.event;
    const nuevaFechaInicio = new Date(event.start); // Utiliza la fecha y hora del evento directamente
    const nuevaFechaFinal = new Date(event.end); // Utiliza la fecha y hora del evento directamente
    const idActividad = event.id;

    // Verificar la superposición con otras actividades
    const existeSuperposicion = this.actividades.some(actividad => {
      // Convertir las fechas de las actividades existentes a objetos Date
      const fechaInicioExistente = new Date(actividad.horaInicio);
      const fechaFinalExistente = new Date(actividad.horaFinal);

      // Si la actividad es la misma que se está moviendo, se omitirá la comparación
      if (actividad.id_actividad == idActividad) {
        return false;
      }

      return (
        // Verificar si la nueva actividad comienza antes de que termine una actividad existente
        (nuevaFechaInicio < fechaFinalExistente && nuevaFechaFinal > fechaInicioExistente) ||
        // Verificar si la nueva actividad termina después de que comienza una actividad existente
        (nuevaFechaFinal > fechaInicioExistente && nuevaFechaInicio < fechaFinalExistente) ||
        // Verificar si la nueva actividad está completamente dentro de una actividad existente
        (nuevaFechaInicio >= fechaInicioExistente && nuevaFechaFinal <= fechaFinalExistente)
      );
    });

    if (existeSuperposicion) {
      console.log('Ya hay una actividad programada en este intervalo de tiempo.');
      // Si hay superposición, revierte los cambios arrastrando el evento de nuevo a su posición original
      eventDropInfo.revert();
      return;
    }

    // Actualizar la actividad con las nuevas fechas y horas
    const actividadActualizada: Actividad = {
      id_actividad: idActividad,
      nombre: event.title,
      descripcion: event.extendedProps.descripcion, // Accede a la descripción a través de extendedProps
      horaInicio: nuevaFechaInicio.toISOString(), // Serializa la fecha y hora en formato ISO 8601
      horaFinal: nuevaFechaFinal.toISOString(), // Serializa la fecha y hora en formato ISO 8601
      capacidad: event.capacidad,
      users: []
    };

    this.actualizarActividad(actividadActualizada);
    location.reload();
  }


  actualizarActividad(actividad: Actividad) {
    this.actividadService.actualizarActividad(actividad).subscribe(
      (actividadActualizada) => {

        console.log('Actividad actualizada:', actividadActualizada);
        // Aquí puedes realizar cualquier otra acción después de la actualización, si es necesario
      },
      error => {
        console.error('Error al actualizar la actividad:', error);
        // Si hay un error, revierte los cambios arrastrando el evento de nuevo a su posición original
      }
    );
  }

  borrarRutina(id: number) {
    this.actividadService.borrarRutina(id).subscribe(
      () => {
        console.log('Rutina borrada exitosamente');
        // Realizar cualquier acción adicional después de borrar la rutina
      },
      error => {
        console.error('Error al borrar la rutina:', error);
        // Manejar el error según sea necesario
      }
    );
  }
}
