import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AniadirHoraDisponibleComponent } from 'src/app/pages/aniadir-hora-disponible/aniadir-hora-disponible.component';
import { CrearSalaComponent } from 'src/app/pages/crear-sala/crear-sala.component';
import { CrearRutinaComponent } from 'src/app/pages/actividades/crear-actividades/crear-actividad.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-navbar-rutina',
  templateUrl: './navbar-rutina.component.html',
  styleUrls: ['./navbar-rutina.component.css']
})
export class NavbarRutinaComponent implements OnInit{
  @Input() gimnasioId: number | undefined;
  rol!: any;
  constructor(private router: Router, private dialog: MatDialog, private loginservice: LoginService) { }


  ngOnInit(): void {
    this.rol=this.loginservice.getUserRole();
  }


  abrirDialogoCrearRutina(): void {
    const dialogRef = this.dialog.open(CrearRutinaComponent, {
      width: '500px',
      data: { idGimnasio: this.gimnasioId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('El diálogo se cerró con el resultado:', result);
     
    });
  }

  abrirDialogoCrearSala(): void {
    const dialogRef = this.dialog.open(CrearSalaComponent, {
      width: '500px',
      data: { idGimnasio: this.gimnasioId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('El diálogo se cerró con el resultado:', result);
    });
  }

  abrirDialogoAniadirDisponibilidad(): void {
    const dialogRef = this.dialog.open(AniadirHoraDisponibleComponent, {
      width: '500px', 
      data: { idGimnasio: this.gimnasioId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('El diálogo se cerró con el resultado:', result);
    });
  }

  volver() {
    this.router.navigate(['']);
  }
}
