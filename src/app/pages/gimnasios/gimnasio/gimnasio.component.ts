import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { Gimnasio } from 'src/app/models/gimnasio/gimnasio';
import { GimnasioService } from 'src/app/services/gimnasio.service';
import { LoginService } from 'src/app/services/login.service';
import { CrearGimnasioComponent } from '../crear-gimnasio/crear-gimnasio.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-gimnasio',
  templateUrl: './gimnasio.component.html',
  styleUrls: ['./gimnasio.component.css']
})
export class GimnasioComponent {


  gimnasios: Gimnasio[] = [];
  isLoggedOn: boolean = false;
  singleClick = false;
  user!: User;
  registrado: boolean= false;
  public estaRegistradoEnGimnasio: boolean = false;
  logos: { [key: number]: string | ArrayBuffer | null } = {}; // Objeto para almacenar las URLs de los logos

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
    this.getGimnasios();
    this.user = this.loginService.getUser();
    console.log(this.verLogo(1))
  }

  getGimnasios(): void {
    this.gimnasioService.verGimnasios()
      .subscribe(gimnasios => {
        this.gimnasios = gimnasios;
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
        // Maneja el error, si es necesario
      }
    );
  }
  


  public eliminarGimnasio(id: number): void {
    this.gimnasioService.eliminarGimnasio(id).subscribe(
      () => {

        console.log('El gimnasio se eliminó correctamente.');
        // Aquí puedes actualizar la lista de gimnasios o realizar otras acciones necesarias después de eliminar
      },
      (error: any) => {
        console.error('Error al eliminar el gimnasio:', error);
        // Aquí puedes mostrar un mensaje de error al usuario o realizar otras acciones necesarias en caso de error
      }
    );
  }


  // Método para obtener el logo de un gimnasio por su ID
  



  // Método para manejar el doble clic
  handleDoubleClick(idGimnasio: number) {
    if (this.singleClick) {
      // Realiza la acción que deseas al detectar el doble clic, por ejemplo, navegar al detalle del gimnasio
      this.usuarioRegistradoEnGimnasio(idGimnasio).subscribe(
        registrado => {
          if (registrado) {
            // Realiza la acción que deseas al detectar el doble clic, por ejemplo, navegar al detalle del gimnasio
            this.router.navigateByUrl('/ver-gimnasio/' + idGimnasio);
          } else {
            alert("Debes registrarte en el gimnasio antes de poder acceder a el")
          }
        }
      );
    } else {
      // Si es el primer clic, marca singleClick como true y espera un corto período para detectar un segundo clic
      this.singleClick = true;
      setTimeout(() => {
        this.singleClick = false;
      }, 250); // Puedes ajustar este valor según tus necesidades
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

  usuarioRegistradoEnGimnasio(idGimnasio: number): Observable<boolean> {
    
    return this.gimnasioService.verGimnasioPorId(idGimnasio).pipe(
      map(gimnasio => gimnasio.usuarios.includes(this.user.username))
    );
    
  }

  registrarUsuarioEnGimnasio(gimnasioId: number) {
    this.gimnasioService.registrarUsuarioEnGimnasio(gimnasioId, this.user.id).subscribe(
      (response) => {
        console.log('Usuario añadido con exito');
        alert("Te acabas de registrar en el gimnasio")
        // Puedes realizar cualquier otra acción aquí después de registrar al usuario en el gimnasio
      },
      error => {
        alert("Ya estas registrado")
        console.error('Error al registrar usuario en el gimnasio:', error);
        // Manejo de errores aquí
      }
    );
  }
  
}
