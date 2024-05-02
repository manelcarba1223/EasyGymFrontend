import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Ejercicio } from 'src/app/models/ejercicio';
import { Actividad } from 'src/app/models/Actividad';
import { User } from 'src/app/models/user/user';
import { EjercicioService } from 'src/app/services/ejercicio.service';
import { GimnasioService } from 'src/app/services/gimnasio.service';
import { LoginService } from 'src/app/services/login.service';
import { RutinaService } from 'src/app/services/rutina.service';
import { HorasDisponiblesService } from 'src/app/services/horas-disponibles.service';
import { HorasDisponibles } from 'src/app/models/horas-disponibles/horas-disponibles.component';

@Component({
  selector: 'app-ver-gimnasio',
  templateUrl: './ver-gimnasio.component.html',
  styleUrls: ['./ver-gimnasio.component.css']
})
export class VerGimnasioComponent implements OnInit {
  actividades!: Actividad[];
  titulo!: string;
  ejercicios!: Ejercicio[];
  idGimnasio!: number;
  mostrarSelectEjercicios: boolean = false;
  ejercicioSeleccionado!: Ejercicio;
  user!: User;
  usuarioRegistrado$: Observable<boolean> | undefined;
  horasDisponibles!: HorasDisponibles[];

  constructor(
    private route: ActivatedRoute,
    private gimnasioService: GimnasioService,
    private ejercicioService: EjercicioService,
    private loginService: LoginService,
    private horasDisponiblesService: HorasDisponiblesService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idGimnasio = +params['id']; // Obtiene el id del gimnasio de los parámetros de la ruta
      this.obtenerGimnasio(this.idGimnasio);
    });
    this.user=this.loginService.getUser();
    this.usuarioRegistrado$=this.usuarioRegistradoEnGimnasio();
    this.obtenerHorasDisponibles(this.idGimnasio)
  }



  obtenerGimnasio(idGimnasio: number): void {
    this.gimnasioService.verGimnasioPorId(idGimnasio).subscribe(
      gimnasio => {
        this.titulo = gimnasio.nombre;
        this.actividades = gimnasio.actividades!;
        console.log(gimnasio)
        console.log(this.actividades)

      },
      error => {
        console.log("Error al obtener el titulo")
      }
    );
  }

 

  agregarEjercicio(rutinaId: number, idEjercicio: number): void {
    if (!this.ejercicioSeleccionado) {
      console.error('No se ha seleccionado ningún ejercicio.');
      return;
    }
    this.ejercicioService.agregarEjercicioARutina(rutinaId, idEjercicio).subscribe(
      () => {
        console.log('Ejercicio agregado a la rutina correctamente');
        this.mostrarSelectEjercicios = false;
      },
      error => {
        console.error('Error al agregar ejercicio a la rutina:', error);
      }
    );
  }


  // Método para manejar el evento de clic en el botón "Add" y mostrar u ocultar el select de ejercicios
  mostrarSelect(): void {
    this.mostrarSelectEjercicios = !this.mostrarSelectEjercicios;
  }

  usuarioRegistradoEnGimnasio(): Observable<boolean> {
    return this.gimnasioService.verGimnasioPorId(this.idGimnasio).pipe(
      map(gimnasio => gimnasio.usuarios.includes(this.user.username))
    );
    
  }

  obtenerHorasDisponibles(idGimnasio: number){
    this.horasDisponiblesService.devolverHorasDisponibles(idGimnasio).subscribe(
      (horasDisponibles: HorasDisponibles[])=>{
        this.horasDisponibles=horasDisponibles;
        console.log(horasDisponibles)
        console.log(this.horasDisponibles)
      },
      (error: any)=>{
        console.log("Error "+error)
      }
    )
  }
}


