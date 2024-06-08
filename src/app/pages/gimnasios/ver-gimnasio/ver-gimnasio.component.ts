import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/models/user/user';
import { GimnasioService } from 'src/app/services/gimnasio.service';
import { LoginService } from 'src/app/services/login.service';
import { HorasDisponiblesService } from 'src/app/services/horas-disponibles.service';
import { HorasDisponibles } from 'src/app/models/horas-disponibles/horas-disponibles.component';
import { SalaService } from 'src/app/services/sala.service';
import { Sala } from 'src/app/models/sala/sala/sala.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Gimnasio } from 'src/app/models/gimnasio/gimnasio';
import { Actividad } from 'src/app/models/actividad/Actividad';

@Component({
  selector: 'app-ver-gimnasio',
  templateUrl: './ver-gimnasio.component.html',
  styleUrls: ['./ver-gimnasio.component.css']
})
export class VerGimnasioComponent implements OnInit {
  actividades!: Actividad[];
  titulo!: string;
  idGimnasio!: number;
  user!: User;
  usuarioRegistrado$: Observable<boolean> | undefined;
  horasDisponibles!: HorasDisponibles[];
  idSalaSeleccionada!: number;
  salas!: Sala[];
  rol!: any;
  nombreGimnasio!: String;

  constructor(
    private route: ActivatedRoute,
    private gimnasioService: GimnasioService,
    private loginService: LoginService,
    private horasDisponiblesService: HorasDisponiblesService,
    private salaService: SalaService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idGimnasio = +params['id']; 
      this.obtenerSalas(this.idGimnasio)
    });
    this.user = this.loginService.getUser();
    this.usuarioRegistrado$ = this.usuarioRegistradoEnGimnasio();
    this.rol = this.loginService.getUserRole();
    this.obtenerGimnasio(this.idGimnasio)
  }

  obtenerGimnasio(idGimnasio: number){
    this.gimnasioService.verGimnasioPorId(idGimnasio).subscribe(
      (gimnasio)=>{
        this.nombreGimnasio=gimnasio.nombre;
      },
      (error)=>{
        console.log(error +" error al obtener el gimnasio")
      }
    )
  }

  /**
   * Metodo para obtener las actividades y el nombre de la sala
   * @param idGimnasio 
   */
  obtenerSala(idGimnasio: number): void {
    this.salaService.obtenerSalaPorId(idGimnasio).subscribe(
      sala => {
        this.titulo = sala.nombre;
        this.actividades = sala.actividades!;
      },
      error => {
        console.log("Error al obtener el titulo")
      }
    );
  }

  /**
   * Metodo que obtiene todas las salas de un gimnasio
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
   * Metodo que llama a las funciones que obtienen las horas disponibles y la sala
   * @param idSala 
   */
  seleccionarSala(idSala: number) {
    this.idSalaSeleccionada = idSala;
    this.obtenerHorasDisponibles(this.idSalaSeleccionada);
    this.obtenerSala(this.idSalaSeleccionada);
  }


  /**
   * Metodo para eliminar una sala
   * @param idSala 
   * @param event 
   */
  eliminarSala(idSala: number, event: Event): void {
    event.stopPropagation(); // Evitar que el clic en el botón de eliminar dispare seleccionarSala

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: '¿Estás seguro de que deseas eliminar esta sala?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salaService.eliminarSalaPorId(idSala).subscribe(
          () => {
            Swal.fire('Exito', 'Sala eliminada con exito', 'success');
            // Actualizar la lista de salas después de la eliminación
            this.salas = this.salas.filter(sala => sala.idSala !== idSala);
          },
          error => {
            Swal.fire('Error', 'Error al eliminar la sala', 'error');
          }
        );
      }
    });
  }

  

  usuarioRegistradoEnGimnasio(): Observable<boolean> {
    return this.gimnasioService.verGimnasioPorId(this.idGimnasio).pipe(
      map(gimnasio => gimnasio.usuarios.includes(this.user.username))
    );
  }

  obtenerHorasDisponibles(idGimnasio: number) {
    this.horasDisponiblesService.devolverHorasDisponibles(idGimnasio).subscribe(
      (horasDisponibles: HorasDisponibles[]) => {
        this.horasDisponibles = horasDisponibles;
      },
      (error: any) => {
        console.log("Error " + error)
      }
    )
  }
}


