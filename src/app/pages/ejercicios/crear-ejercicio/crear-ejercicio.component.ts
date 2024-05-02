import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EjercicioService } from 'src/app/services/ejercicio.service';

@Component({
  selector: 'app-crear-ejercicio',
  templateUrl: './crear-ejercicio.component.html',
  styleUrls: ['./crear-ejercicio.component.css']
})
export class CrearEjercicioComponent {
  formulario!: FormGroup;

  constructor(private fb: FormBuilder, private ejercicioService: EjercicioService) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      musculoPrincipal: ['', Validators.required],
      musculoSecundario: this.fb.array(['']) // Inicialmente un elemento en el conjunto
    });
  }

  get musculoSecundario(): FormArray {
    return this.formulario.get('musculoSecundario') as FormArray;
  }

  agregarMusculoSecundario(): void {
    this.musculoSecundario.push(this.fb.control(''));
  }

  eliminarMusculoSecundario(index: number): void {
    this.musculoSecundario.removeAt(index);
  }

  submitForm(): void {

    this.ejercicioService.guardarEjercicio(this.formulario.value)
      .subscribe(nuevoEjercicio => {
        console.log('Ejercicio creado:', nuevoEjercicio);
        // Aquí podrías realizar acciones adicionales después de crear la rutina, como redirigir al usuario a otra página
      },
        error => {
          console.log(error);
          alert('Error al crear el gimnasio');
        });

  }

}
