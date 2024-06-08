import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { GimnasioComponent } from './pages/gimnasios/gimnasio/gimnasio.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { CrearGimnasioComponent } from './pages/gimnasios/crear-gimnasio/crear-gimnasio.component';
import { VerGimnasioComponent } from './pages/gimnasios/ver-gimnasio/ver-gimnasio.component';
import { CrearRutinaComponent } from './pages/actividades/crear-actividades/crear-actividad.component';
import { VerUsuarioComponent } from './pages/ver-usuario/ver-usuario.component';
import { InicioComponent } from './pages/inicio/inicio/inicio.component';
import { CrearSalaComponent } from './pages/crear-sala/crear-sala.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'gimnasios', component: GimnasioComponent },
  { path: 'signup', component: SignupComponent }, 
  { path: 'login', component: LoginComponent }, 
  { path: 'editar-gimnasio/:id', component: CrearGimnasioComponent },
  { path: 'crear-gimnasio', component: CrearGimnasioComponent },
  { path: 'ver-gimnasio/:id', component: VerGimnasioComponent },
  {path: 'crearRutina/:id', component: CrearRutinaComponent},
  {path: 'ver-usuario/:username', component: VerUsuarioComponent},
  {path: 'crear-sala/:idGimnasio', component: CrearSalaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
