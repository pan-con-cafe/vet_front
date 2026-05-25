import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CirugiaService } from '../../../../core/services/cirugia.service';
import { MatDatepickerModule } from '@angular/material/datepicker';


@Component({
  selector: 'app-nueva-cirugia-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './nueva-cirugia-dialog.component.html',
  styleUrl: './nueva-cirugia-dialog.component.scss'
})
export class NuevaCirugiaDialogComponent {
  descripcion = '';
  fecha = '';
  error = '';
  maxDate = new Date();

  constructor(
    private dialogRef: MatDialogRef<NuevaCirugiaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cirugiaService: CirugiaService
  ) {}

  save() {
    if (!this.descripcion.trim()) { this.error = 'La descripción es requerida'; return; }
    if (!this.fecha) { this.error = 'La fecha es requerida'; return; }

    const d = new Date(this.fecha);
    const fechaStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    this.cirugiaService.create({
      mascota_FK: this.data.mascotaId,
      description: this.descripcion,
      date: fechaStr,
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.error = 'Error al guardar'
    });
  }

  close() { this.dialogRef.close(); }
}
