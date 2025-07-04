import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { EmpleadosService, Empleado } from '../../services/empleados.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EmpleadoFormComponent } from '../empleados-form/empleados-form.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmpleadosDatagridComponent } from '../empleados-datagrid/empleados-datagrid.component';
import { EmpleadoDetalleComponent } from '../empleado-detalle/empleado-detalle.component';
import { ConfirmarEliminacionComponent } from '../confirmar-eliminacion/confirmar-eliminacion.component';
import { Header } from '../header/header.component';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  templateUrl: './empleados-list.component.html',
  styleUrls: ['./empleados-list.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    EmpleadosDatagridComponent,
    Header
  ],
  providers: [EmpleadosService]
})
export class EmpleadosListComponent implements OnInit, AfterViewInit {
  empleados: Empleado[] = [];
  dataSource = new MatTableDataSource<Empleado>([]);
  displayedColumns: string[] = ['id', 'nombre', 'correo', 'cargo', 'departamento', 'telefono', 'fechaIngreso', 'activo', 'acciones'];
  cargando = false;
  filtroControl = new FormControl('');
  today = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private empleadosService = inject(EmpleadosService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.obtenerEmpleados();

    this.filtroControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300)
    ).subscribe(value => {
      this.dataSource.filter = value?.trim().toLowerCase() || '';
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerEmpleados(): void {
    this.cargando = true;
    this.empleadosService.getAll().subscribe({
      next: (response) => {
        const data = response.body || [];
        this.empleados = data;
        this.dataSource.data = data;
        this.cargando = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar empleados', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  verDetalle(empleado: Empleado): void {
    this.dialog.open(EmpleadoDetalleComponent, {
      width: '600px',
      data: empleado
    });
  }

  editarEmpleado(id: number): void {
    const dialogRef = this.dialog.open(EmpleadoFormComponent, {
      width: '500px',
      disableClose: true,
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerEmpleados();
      }
    });
  }

  eliminarEmpleado(id: number): void {
    const dialogRef = this.dialog.open(ConfirmarEliminacionComponent, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.empleadosService.delete(id).subscribe({
          next: () => {
            this.snackBar.open('Empleado eliminado con éxito', 'Cerrar', { duration: 3000 });
            this.obtenerEmpleados();
          },
          error: () => {
            this.snackBar.open('Error al eliminar empleado', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  crearEmpleado(): void {
    const dialogRef = this.dialog.open(EmpleadoFormComponent, {
      width: '500px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerEmpleados();
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  isFilaInvalida(emp: Empleado): boolean {
    const nombreInvalido = emp.nombre === 'string';
    const fecha = new Date(emp.fechaIngreso);
    const fechaFutura = fecha > this.today;
    return nombreInvalido || fechaFutura;
  }
  actualizarActivo(empActualizado: Empleado) {
    this.empleadosService.update(empActualizado.id, empActualizado).subscribe(() => {
      const idx = this.empleados.findIndex(e => e.id === empActualizado.id);
      if (idx !== -1) {
        this.empleados[idx].activo = empActualizado.activo;
        this.dataSource.data = [...this.empleados];
      }
      this.snackBar.open('Estado actualizado', 'Cerrar', { duration: 2000 });
    });
  }
}
