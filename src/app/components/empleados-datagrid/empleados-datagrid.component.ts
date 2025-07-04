import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Empleado, EmpleadosService } from '../../services/empleados.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EmpleadoFormComponent } from '../empleados-form/empleados-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-empleados-datagrid',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './empleados-datagrid.component.html',
  styleUrls: ['./empleados-datagrid.component.scss']
})
export class EmpleadosDatagridComponent implements AfterViewInit {
  @Input() empleados: Empleado[] = [];
  @Output() editar = new EventEmitter<number>();
  @Output() eliminar = new EventEmitter<number>();
  @Output() verDetalle = new EventEmitter<Empleado>();
  @Output() cambiarActivoEstado = new EventEmitter<Empleado>();

  displayedColumns: string[] = ['id', 'nombre', 'correo', 'cargo', 'departamento', 'telefono', 'fechaIngreso', 'activo', 'acciones'];
  cargando = false;
  dataSource = new MatTableDataSource<Empleado>([]);
  today = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private empleadosService = inject(EmpleadosService);

  ngOnChanges() {
    this.dataSource.data = this.empleados;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  // Agregar método para emitir el evento de ver detalle
  onVerDetalle(emp: Empleado) {
    this.verDetalle.emit(emp);
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

  cambiarActivo(emp: Empleado) {
    const actualizado = { ...emp, activo: !emp.activo };
    this.cambiarActivoEstado.emit(actualizado);
  }
}
