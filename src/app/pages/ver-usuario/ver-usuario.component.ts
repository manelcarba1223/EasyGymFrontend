import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user.service';
import { Gimnasio } from '../../models/gimnasio/gimnasio';

@Component({
  selector: 'app-ver-usuario',
  templateUrl: './ver-usuario.component.html',
  styleUrls: ['./ver-usuario.component.css']
})
export class VerUsuarioComponent implements OnInit {
  user!: User;
  username!: string;
  singleClick = false;
  gimnasios: Gimnasio[];
  constructor(
    private route: ActivatedRoute,
    private userService: UserService, private router: Router
  ) { 
    this.gimnasios=[];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.obtenerUsuario(this.username);
    });
  }


  obtenerUsuario(username: string): void {
    this.userService.obtenerUsuarioPorUsername(username).subscribe(
      usuario => {
        this.user = usuario;
        this.gimnasios = usuario.gimnasios;
      },
      error => {
        console.log("Error al obtener el usuario")
      }
    );
  }

  // Método para manejar el doble clic
  handleDoubleClick(gymId: number) {
    if (this.singleClick) {
      // Realiza la acción que deseas al detectar el doble clic, por ejemplo, navegar al detalle del gimnasio
      this.router.navigateByUrl('/ver-gimnasio/' + gymId);
    } else {
      // Si es el primer clic, marca singleClick como true y espera un corto período para detectar un segundo clic
      this.singleClick = true;
      setTimeout(() => {
        this.singleClick = false;
      }, 250); // Puedes ajustar este valor según tus necesidades
    }
  }

  getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.user.birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
