import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HorasDisponibles } from 'src/app/models/horas-disponibles/horas-disponibles.component';
import { HorasDisponiblesService } from 'src/app/services/horas-disponibles.service';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-aniadir-hora-disponible',
  templateUrl: './aniadir-hora-disponible.component.html',
  styleUrls: ['./aniadir-hora-disponible.component.css']
})
export class AniadirHoraDisponibleComponent implements OnInit {

  usuario!: any;
  horasDisponiblesForm!: FormGroup;
  gimnasioId!: number; // Use camelCase for property names

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AniadirHoraDisponibleComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { idGimnasio: number }, // Use camelCase
    private horasDisponiblesService: HorasDisponiblesService,
  ) { }

  ngOnInit(): void {
    this.gimnasioId = this.data.idGimnasio; // Use camelCase

    this.horasDisponiblesForm = this.fb.group({
      horaInicio: ['', Validators.required],
      horaFinal: ['', Validators.required]
    });
  }

  agregarHoras() {
    if (this.horasDisponiblesForm.valid) {
      const newHoraDisponible: HorasDisponibles = {
        id: 0,
        horaInicio: this.horasDisponiblesForm.value.horaInicio+"+00:00",
        horaFinal: this.horasDisponiblesForm.value.horaFinal+"+00:00"
      };
      console.log(newHoraDisponible)

      this.horasDisponiblesService.agregarHorasDisponibles(this.gimnasioId, newHoraDisponible)
        .subscribe(response => {
          console.log('Hora disponible creada:', response);
          this.dialogRef.close('Hora creada'); // Close the dialog with a success message
        },
        error => {
          console.error('Error creando hora disponible:', error);
          // Handle error for user feedback (e.g., display error message)
        });
    }
  }
}