import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatListModule} from '@angular/material/list';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Importa MatDatepickerModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { authInterceptorProviders } from './interceptor/auth.interceptor';
import { GimnasioComponent } from './pages/gimnasios/gimnasio/gimnasio.component';
import { CrearGimnasioComponent } from './pages/gimnasios/crear-gimnasio/crear-gimnasio.component';
import { VerGimnasioComponent } from './pages/gimnasios/ver-gimnasio/ver-gimnasio.component';
import { NavbarRutinaComponent } from './shared/navbar-rutina/navbar-rutina.component';
import { CrearRutinaComponent } from './pages/actividades/crear-actividades/crear-actividad.component';
import { VerUsuarioComponent } from './pages/ver-usuario/ver-usuario.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InicioComponent } from './pages/inicio/inicio/inicio.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component'; // Importa FullCalendarModule
import { MatButtonModule } from '@angular/material/button';
import { AniadirHoraDisponibleComponent } from './pages/aniadir-hora-disponible/aniadir-hora-disponible.component';
import { CrearSalaComponent } from './pages/crear-sala/crear-sala.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es-ES');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    GimnasioComponent,
    CrearGimnasioComponent,
    VerGimnasioComponent,
    NavbarRutinaComponent,
    CrearRutinaComponent,
    VerUsuarioComponent,
    InicioComponent,
    CalendarioComponent,
    ConfirmationDialogComponent,
    AniadirHoraDisponibleComponent,
    CrearSalaComponent
      ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatGridListModule,
    HttpClientModule ,
    MatDatepickerModule, 
    ReactiveFormsModule,
    FormsModule ,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,
    FullCalendarModule,
    MatButtonModule,
    MatTooltipModule

   ],
  providers: [authInterceptorProviders,
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
