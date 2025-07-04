import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Empleado } from '../../services/empleados.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empleado-detalle',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './empleado-detalle.component.html',
  styleUrls: ['./empleado-detalle.component.scss']
})
export class EmpleadoDetalleComponent {
  constructor(
    public dialogRef: MatDialogRef<EmpleadoDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Empleado
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
