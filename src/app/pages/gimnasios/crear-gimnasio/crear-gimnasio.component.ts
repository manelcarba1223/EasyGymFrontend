import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Gimnasio } from 'src/app/models/gimnasio/gimnasio';
import { GimnasioService } from 'src/app/services/gimnasio.service';

@Component({
  selector: 'app-crear-gimnasio',
  templateUrl: './crear-gimnasio.component.html',
  styleUrls: ['./crear-gimnasio.component.css']
})
export class CrearGimnasioComponent {

  titulo!: string;
  gimnasioForm!: FormGroup;
  action!: string;
  logoFile: File | null = null; // Variable to store the selected logo file

  constructor(
    public dialogRef: MatDialogRef<CrearGimnasioComponent>,
    private formBuilder: FormBuilder,
    private gimnasioService: GimnasioService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.action = data.action;
    this.titulo = this.action === 'editar' ? 'Editar Gimnasio' : 'Crear Gimnasio';
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.action === 'editar') {
      this.setGimnasioDataToForm(this.data.gimnasioId);
    }
  }

  initializeForm(): void {
    this.gimnasioForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      ciudad: ['', Validators.required],
      descripcion: ['', Validators.required],
      logo: [null] // Initialize the logo field with null

      // Remove the 'logo' field from here
    });
  }

  setGimnasioDataToForm(gimnasioId: number): void {
    // Obtener los datos del gimnasio a editar y establecerlos en el formulario
    this.gimnasioService.verGimnasioPorId(gimnasioId).subscribe(
      gimnasio => {
        this.gimnasioForm.patchValue({
          nombre: gimnasio.nombre,
          ciudad: gimnasio.ciudad,
          descripcion: gimnasio.descripcion,
          logo: null
          // Establecer más campos según sea necesario
        });
      },
      error => {
        console.log(error);
        alert('Error al obtener los datos del gimnasio');
      }
    );
  }

  formSubmit(): void {
    if (this.gimnasioForm.valid) {
      const gimnasioData = this.gimnasioForm.value;
  
      if (this.action === 'crear') {
        console.log(this.logoFile)

        this.gimnasioService.crearGimnasio(gimnasioData).subscribe(
          (response: any) => {
            console.log(response);
            alert('Gimnasio creado con éxito');
            const gimnasioId = response.id; // Obtener el ID del gimnasio creado
            if (this.logoFile) {
              this.subirLogo(gimnasioId, this.logoFile); // Subir el logo si está presente
            } else {
              this.dialogRef.close(true); // Si no hay logo, cerrar el diálogo
            }
          },
          error => {
            console.log("Error" +error.name);
            alert('Error al crear el gimnasio');
          }
        );
      } else if (this.action === 'editar') {
        // Obtener el ID del gimnasio a editar
        const gimnasioId = this.data.gimnasioId; // Asegúrate de proporcionar el ID del gimnasio desde el componente padre
        this.gimnasioService.editarGimnasio(gimnasioId, gimnasioData).subscribe(
          response => {
            console.log(response);
            alert('Gimnasio editado con éxito');
            this.dialogRef.close(true); // Cerrar el diálogo y enviar true como resultado
          },
          error => {
            console.log(error);
            alert('Error al editar el gimnasio');
          }
        );
      }
    }
  }

  subirLogo(idGmnasio: number, file: File){
    this.gimnasioService.cargarLogoGimnasio(idGmnasio, file).subscribe(
      ()=>{
        console.log("Logo actualizado")
      },
      (error)=>{
        console.log("Error al subir el logo "+error)
      }
    )
  }

  cancelar(): void {
    this.dialogRef.close(false); // Cerrar el diálogo y enviar false como resultado
  }


  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.logoFile = files[0];
    } else {
      this.logoFile = null;
    }
  }
}