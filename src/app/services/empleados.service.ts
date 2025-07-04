import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Empleado {
  id: number;
  nombre: string;
  correo: string;
  cargo?: string;
  departamento?: string;
  telefono?: string;
  fechaIngreso: string; // ISO 8601 (por ejemplo: "2023-07-01")
  activo: boolean;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PagedResult<T> {
  items: T[];
  pagination: Pagination;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = `${environment.apiUrl}/empleados`;

  constructor(private http: HttpClient) { }

  // Obtener todos los empleados con paginación y filtro opcional
  getAll(): Observable<HttpResponse<Empleado[]>> {
    return this.http.get<Empleado[]>(this.apiUrl, {
      observe: 'response'
    }).pipe(delay(500));
  }

  // Obtener un empleado por ID
  getById(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`).pipe(delay(500));
  }

  // Crear un nuevo empleado
  create(empleado: Omit<Empleado, 'id'>): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado).pipe(delay(500));
  }

  // Actualizar un empleado existente
  update(id: number, empleado: Empleado): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, empleado).pipe(delay(500));
  }

  // Eliminar un empleado
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(delay(500));
  }
}
