import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmar-eliminacion',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <mat-icon color="warn" class="icono-grande">warning</mat-icon>
      <h2>¿Eliminar empleado?</h2>
      <p>Esta acción no se puede deshacer.</p>
      <div class="acciones">
        <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
        <button mat-raised-button color="warn" (click)="dialogRef.close(true)">Eliminar</button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      text-align: center;
      padding: 2rem 1.5rem 1rem 1.5rem;
    }
    .icono-grande {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 8px;
    }
    .acciones {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    h2 {
      margin: 1rem 0 0.5rem 0;
    }
    p {
      color: #888;
      margin-bottom: 0;
    }
  `]
})
export class ConfirmarEliminacionComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmarEliminacionComponent>) {}
}
