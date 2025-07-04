import { Routes } from '@angular/router';
import { EmpleadosListComponent } from 'src/app/components/empleados-list/empleados-list.component';
import { EmpleadoFormComponent } from 'src/app/components/empleados-form/empleados-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'empleados', pathMatch: 'full' },
  { path: 'empleados', component: EmpleadosListComponent },
  { path: 'empleados/nuevo', component: EmpleadoFormComponent },
  { path: 'empleados/editar/:id', component: EmpleadoFormComponent }
];
