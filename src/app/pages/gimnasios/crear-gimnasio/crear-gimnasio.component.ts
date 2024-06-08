import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Gimnasio } from 'src/app/models/gimnasio/gimnasio';
import { User } from 'src/app/models/user/user';
import { GimnasioService } from 'src/app/services/gimnasio.service';
import { LoginService } from 'src/app/services/login.service';
import { RutinaService } from 'src/app/services/actividad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-gimnasio',
  templateUrl: './crear-gimnasio.component.html',
  styleUrls: ['./crear-gimnasio.component.css']
})
export class CrearGimnasioComponent {
  titulo!: string;
  gimnasioForm!: FormGroup;
  action!: string;
  logoFile: File | null = null;
  user!: User;

  constructor(
    public dialogRef: MatDialogRef<CrearGimnasioComponent>,
    private formBuilder: FormBuilder,
    private gimnasioService: GimnasioService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loginService: LoginService
  ) {
    this.action = data.action;
    this.titulo = this.action === 'editar' ? 'Editar Gimnasio' : 'Crear Gimnasio';
    this.inicializarFormualrio();
  }

  ngOnInit(): void {
    if (this.action === 'editar') {
      this.setDatosGimnasio(this.data.gimnasioId);
    }
    this.user = this.loginService.getUser();
  }

  inicializarFormualrio(): void {
    this.gimnasioForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      ciudad: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', ],
      logo: []
    });
  }

  /**
   * Metodo que obtiene los datos actuales para editarlos
   * @param gimnasioId 
   */
  setDatosGimnasio(gimnasioId: number): void {
    this.gimnasioService.verGimnasioPorId(gimnasioId).subscribe(
      gimnasio => {
        this.gimnasioForm.patchValue({
          nombre: gimnasio.nombre,
          ciudad: gimnasio.ciudad,
          descripcion: gimnasio.descripcion,
          logo: null
        });
      },
      error => {
        console.log(error);
        Swal.fire('Error', 'Error al obtener los datos del gimnasio', 'error');
      }
    );
  }

  /**
   * Metodo que llama al servicio para registrar el usuario en un gimnasio por id
   * @param gimnasioId 
   */
  registrarUsuarioEnGimnasio(gimnasioId: number) {
    this.gimnasioService.registrarUsuarioEnGimnasio(gimnasioId, this.user.id).subscribe(
      response => {
        Swal.fire('Éxito', 'Te has registrado en el gimnasio', 'success').then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      },
      error => {
        Swal.fire('Error', 'Ya estás registrado', 'error');
        console.error('Error al registrar usuario en el gimnasio:', error);
      }
    );
  }

  formSubmit(): void {
    if (this.gimnasioForm.valid) {
      const gimnasioData = this.gimnasioForm.value;
  
      if (this.action === 'crear') {
        this.gimnasioService.crearGimnasio(gimnasioData).subscribe(
          (response: any) => {
            const gimnasioId = response.id_gimnasio;
  
            // Registro el usuario en el gimnasio
            this.registrarUsuarioEnGimnasio(gimnasioId);
  
            // Subo el logo si lo hay
            if (this.logoFile) {
              this.subirLogo(gimnasioId, this.logoFile);
            } else {
              this.dialogRef.close(true);
            }
            Swal.fire('Éxito', 'Gimnasio creado con éxito', 'success').then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          },
          error => {
            Swal.fire('Error', 'Error al crear el gimnasio!', 'error');
          }
        );
      } else if (this.action === 'editar') {
        const gimnasioId = this.data.gimnasioId;
        this.gimnasioService.editarGimnasio(gimnasioId, gimnasioData).subscribe(
          response => {
            // Subir el logo si hay
            if (this.logoFile) {
              this.subirLogo(gimnasioId, this.logoFile);
            } else {
              this.dialogRef.close(true);
            }
            Swal.fire('Éxito', 'Gimnasio editado con éxito', 'success').then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          },
          error => {
            Swal.fire('Error', 'Error al editar el gimnasio', 'error');
          }
        );
      }
    } else {
      Swal.fire('Error', 'Formulario no válido. Por favor, revisa los campos.', 'error');
    }
  }

  /**
   * Metodo que llama al servicio para añdir el logo
   * @param idGimnasio 
   * @param file 
   */
  subirLogo(idGimnasio: number, file: File) {
    this.gimnasioService.cargarLogoGimnasio(idGimnasio, file).subscribe(
      response => {
        Swal.fire('Éxito', 'Gimnasio creado con exito', 'success').then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
        this.dialogRef.close(true);
      },
      error => {
        Swal.fire('Error', 'Error al subir el logo', 'error');
      }
    );
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  /**
   * Metodo que detecta el archivo que se selecciona en el formulario
   * @param event 
   */
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.logoFile = files[0];
    } else {
      this.logoFile = null;
    }
  }
}