import { Component, OnInit, inject, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService, Empleado } from '../../services/empleados.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empleados-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './empleados-form.component.html',
  styleUrls: ['./empleados-form.component.scss']
})
export class EmpleadoFormComponent implements OnInit {
  empleadoForm: FormGroup;
  empleadoId?: number;
  erroresServidor: string[] = [];
  maxFechaIngreso = new Date();
  cargando = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private empleadosService = inject(EmpleadosService);
  private snackBar = inject(MatSnackBar);

  constructor(
    @Optional() public dialogRef?: MatDialogRef<EmpleadoFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { id?: number }
  ) {
    this.empleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      cargo: [''],
      departamento: [''],
      telefono: ['', [Validators.pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s0-9]*$/)]],
      fechaIngreso: ['', Validators.required],
      activo: [true]
    });

    if (data && data.id) {
      this.empleadoId = data.id;
    }
  }

  ngOnInit(): void {
    const idParam = this.empleadoId ?? this.route.snapshot.params['id'];
    if (idParam) {
      this.cargando = true;
      this.empleadoId = +idParam;
      this.empleadosService.getById(this.empleadoId).subscribe({
        next: (empleado: Empleado) => {
          this.empleadoForm.patchValue(empleado);
          this.cargando = false;
        },
        error: () => {
          this.snackBar.open('Error al cargar el empleado', 'Cerrar', { duration: 3000 });
          this.cargando = false;
          this.cerrar();
        }
      });
    }
  }

  cerrar(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/empleados']);
    }
  }

  guardarEmpleado(): void {
    if (this.empleadoForm.invalid || this.cargando) {
      return;
    }

    this.cargando = true;
    this.erroresServidor = [];

    // Limpiar el teléfono para que solo contenga dígitos
    const formValue = { ...this.empleadoForm.value };
    formValue.telefono = formValue.telefono ? formValue.telefono.replace(/\D/g, '') : '';

    if (this.empleadoId) {
      const empleadoData: Empleado = {
        id: this.empleadoId,
        ...formValue
      };
      this.empleadosService.update(this.empleadoId, empleadoData).subscribe({
        next: () => {
          this.snackBar.open('Empleado actualizado con éxito', 'Cerrar', { duration: 3000 });
          this.cargando = false;
          if (this.dialogRef) {
            this.dialogRef.close(true);
          } else {
            this.router.navigate(['/empleados']);
          }
        },
        error: (error) => {
          console.log('Error del backend:', error);
          this.erroresServidor = this.extraerErrores(error);
          this.snackBar.open('Error al actualizar el empleado', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
    } else {
      this.empleadosService.create(formValue).subscribe({
        next: (nuevoEmpleado: Empleado) => {
          this.snackBar.open(`Empleado ${nuevoEmpleado.nombre} creado con éxito`, 'Cerrar', { duration: 3000 });
          this.cargando = false;
          if (this.dialogRef) {
            this.dialogRef.close(true);
          } else {
            this.router.navigate(['/empleados']);
          }
        },
        error: (error) => {
          console.log('Error del backend:', error);
          this.erroresServidor = this.extraerErrores(error);
          this.snackBar.open('Error al crear el empleado', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
    }
  }

  private extraerErrores(error: any): string[] {
    if (error?.error?.errores && Array.isArray(error.error.errores)) {
      return error.error.errores;
    }
    if (error?.error?.message) {
      return [error.error.message];
    }
    return ['Ocurrió un error inesperado.'];
  }
}
