import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../../core/services/cita.service';

@Component({
  selector: 'app-cancelar-cita-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './cancelar-cita-dialog.component.html',
  styleUrl: './cancelar-cita-dialog.component.scss'
})
export class CancelarCitaDialogComponent{
  error = '';

  constructor(
    private dialogRef: MatDialogRef<CancelarCitaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private citaService: CitaService
  ) {}

  formatFecha(date: string): string {
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  }

  cancelar() {
    this.citaService.delete(this.data.idCita).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.error = 'Error al cancelar'
    });
  }

  close() { this.dialogRef.close(); }
}
