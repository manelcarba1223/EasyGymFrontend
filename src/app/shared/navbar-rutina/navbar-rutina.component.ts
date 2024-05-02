import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AniadirHoraDisponibleComponent } from 'src/app/pages/aniadir-hora-disponible/aniadir-hora-disponible.component';
import { CrearRutinaComponent } from 'src/app/pages/rutinas/crear-rutina/crear-rutina.component';

@Component({
  selector: 'app-navbar-rutina',
  templateUrl: './navbar-rutina.component.html',
  styleUrls: ['./navbar-rutina.component.css']
})
export class NavbarRutinaComponent {
  @Input() gimnasioId: number | undefined;
  constructor(private router: Router, private dialog: MatDialog) { }


  abrirDialogoCrearRutina(): void {
    const dialogRef = this.dialog.open(CrearRutinaComponent, {
      width: '500px', // Ajusta el ancho según tus necesidades
      data: { idGimnasio: this.gimnasioId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('El diálogo se cerró con el resultado:', result);
      // Realiza acciones adicionales si es necesario
    });
  }

  abrirDialogoAniadirDisponibilidad(): void {
    const dialogRef = this.dialog.open(AniadirHoraDisponibleComponent, {
      width: '500px', // Ajusta el ancho según tus necesidades
      data: { idGimnasio: this.gimnasioId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('El diálogo se cerró con el resultado:', result);
      // Realiza acciones adicionales si es necesario
    });
  }

  volver() {
    this.router.navigate(['']);
  }
}
