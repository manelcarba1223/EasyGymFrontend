import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { Gimnasio } from 'src/app/models/gimnasio/gimnasio';
import { GimnasioService } from 'src/app/services/gimnasio.service';
import { LoginService } from 'src/app/services/login.service';
import { CrearGimnasioComponent } from '../crear-gimnasio/crear-gimnasio.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user/user';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gimnasio',
  templateUrl: './gimnasio.component.html',
  styleUrls: ['./gimnasio.component.css']
})
export class GimnasioComponent {
  gimnasios: Gimnasio[] = [];
  gimnasiosFiltrados: Gimnasio[] = [];
  isLoggedOn: boolean = false;
  singleClick = false;
  user!: User;
  registrado: boolean = false;
  public estaRegistradoEnGimnasio: boolean = false;
  public esDueno: { [key: number]: boolean } = {};
  logos: { [key: number]: string | ArrayBuffer | null } = {}; // Objeto para almacenar las URLs de los logos
  rol!: any;
  filtroBuscar: string = ''; // Propiedad para almacenar el término de búsqueda

  constructor(private gimnasioService: GimnasioService, private loginService: LoginService,
    private router: Router, public dialog: MatDialog) { }

  openDialogCrear(): void {
    const dialogRef = this.dialog.open(CrearGimnasioComponent, {
      width: 'auto',
      data: { action: 'crear' } // Pasa los parámetros al diálogo   
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
    });
  }

  ngOnInit(): void {
    this.isLoggedOn = this.loginService.isLoggedIn();
    this.user = this.loginService.getUser();
    this.rol = this.loginService.getUserRole();

    this.getGimnasios(); // Llamamos a getGimnasios primero
  }

  verificarRegistroEnGimnasio(): void {
    // Iterar sobre los gimnasios y verificar si el usuario está registrado en cada uno
    this.gimnasios.forEach(gimnasio => {
      this.usuarioRegistradoEnGimnasio(gimnasio.id_gimnasio).subscribe(
        registrado => {
          // Almacena el estado de registro del usuario para cada gimnasio
          this.esDueno[gimnasio.id_gimnasio] = registrado;
        }
      );
    });
  }

  getGimnasios(): void {
    this.gimnasioService.verGimnasios()
      .subscribe(gimnasios => {
        this.gimnasios = gimnasios;
        this.gimnasiosFiltrados = gimnasios; // Inicializa los gimnasios filtrados
        // Llama a verificarRegistroEnGimnasio para determinar el registro del usuario en cada gimnasio
        this.verificarRegistroEnGimnasio();
        // Llama a verLogo para cargar las URL de los logos de los gimnasios
        this.gimnasios.forEach(gimnasio => this.verLogo(gimnasio.id_gimnasio));
      });
  }

  verLogo(idGimnasio: number) {
    this.gimnasioService.obtenerLogoGimnasio(idGimnasio).subscribe(
      (logoData) => {
        // Procesa la respuesta del servicio para obtener la URL de la imagen
        const reader = new FileReader();
        reader.readAsDataURL(logoData); // Convierte los datos del logo en una URL de imagen
        reader.onloadend = () => {
          // Asigna la URL de la imagen al objeto logos con el ID del gimnasio como clave
          this.logos[idGimnasio] = reader.result;
        };
      },
      (error) => {
        console.error('Error al cargar el logo del gimnasio:', error);
      }
    );
  }

  /**
   * Metodo para eliminar un gimnasio
   * @param id 
   */
  public eliminarGimnasio(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: '¿Estás seguro de que deseas eliminar este gimnasio?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gimnasioService.eliminarGimnasio(id).subscribe(
          () => {
            Swal.fire('Exito', 'El gimnasio se eliminó correctamente.', 'success');

            location.reload()
          },
          (error: any) => {
            Swal.fire('Error', 'Error al eliminar el gimnasio', 'error');

            location.reload()
          }
        );
      }
    })
  }

  // Método para manejar el doble clic
  handleDoubleClick(idGimnasio: number) {
    if (this.singleClick) {
      this.usuarioRegistradoEnGimnasio(idGimnasio).subscribe(
        registrado => {
          if (registrado) {
            this.estaRegistradoEnGimnasio = true; // Actualiza el estado de registro del usuario
            this.router.navigateByUrl('/ver-gimnasio/' + idGimnasio);
          } else {
            Swal.fire('Error', 'Debes registrarte en el gimnasio antes de poder acceder a él', 'warning');

            this.estaRegistradoEnGimnasio = false; // Actualiza el estado de registro del usuario
          }
        }
      );
    } else {
      this.singleClick = true;
      setTimeout(() => {
        this.singleClick = false;
      }, 250);
    }
  }

  openDialogEditar(gimnasioId: number): void {
    const dialogRef = this.dialog.open(CrearGimnasioComponent, {
      width: 'auto',
      height: 'auto',
      data: { action: 'editar', gimnasioId: gimnasioId } // Pasa los parámetros al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
      location.reload()
    });
  }

  /**
   * Metodo para saber si el usuario está o no registrado
   * @param idGimnasio 
   * @returns 
   */
  usuarioRegistradoEnGimnasio(idGimnasio: number): Observable<boolean> {
    return this.gimnasioService.verGimnasioPorId(idGimnasio).pipe(
      map(gimnasio => gimnasio.usuarios.includes(this.user.username))
    );
  }

  /**
   * Metodo para registrar un usuario en un gimnasio
   * @param gimnasioId 
   */
  registrarUsuarioEnGimnasio(gimnasioId: number) {
    console.log("ID " + this.user)
    this.gimnasioService.registrarUsuarioEnGimnasio(gimnasioId, this.user.id).subscribe(
      (response) => {
        console.log('Usuario añadido con exito');
        Swal.fire('Exito', 'Te acabas de registrar en el gimnasio', 'success');

      },
      error => {
        Swal.fire('Error', 'Ya estas registrado', 'warning');

        console.error('Error al registrar usuario en el gimnasio:', error);
      }
    );
  }

  /**
   * Metodo para filtrar gimnasios
   */
  filtrarGimnasios() {
    this.gimnasiosFiltrados = this.gimnasios.filter(gimnasio =>
      gimnasio.nombre.toLowerCase().includes(this.filtroBuscar.toLowerCase()) ||
      gimnasio.ciudad.toLowerCase().includes(this.filtroBuscar.toLowerCase())
    );
  }
}
