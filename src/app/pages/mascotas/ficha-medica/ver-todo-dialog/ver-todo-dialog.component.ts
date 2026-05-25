import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ver-todo-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './ver-todo-dialog.component.html',
  styleUrl: './ver-todo-dialog.component.scss'
})
export class VerTodoDialogComponent {
  titulo = '';

  constructor(
    private dialogRef: MatDialogRef<VerTodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.titulo = data.tipo === 'vacunas' ? 'Todas las vacunas'
      : data.tipo === 'desparacitaciones' ? 'Historial de desparacitaciones'
      : 'Cirugías';
  }

  formatFecha(date: string): string {
    if (!date) return '—';
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  }

  close() { this.dialogRef.close(); }
}
