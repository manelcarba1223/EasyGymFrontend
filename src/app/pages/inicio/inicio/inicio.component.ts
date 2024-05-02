import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit{
  rol!: any;
  user!:User;

  constructor(private loginService: LoginService){}

  ngOnInit(): void {
    this.rol= this.loginService.getUserRole();
    this.user= this.loginService.getUser();
  }

}
