import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DesparacitacionService } from '../../../../core/services/desparacitacion.service';

@Component({
  selector: 'app-nueva-desp-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './nueva-desp-dialog.component.html',
  styleUrl: './nueva-desp-dialog.component.scss'
})
export class NuevaDespDialogComponent implements OnInit{
  form: any = { product: '', date: '', weight: null, dose: null };
  error = '';
  maxDate = new Date();

  constructor(
    private dialogRef: MatDialogRef<NuevaDespDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private despService: DesparacitacionService
  ) {}

  ngOnInit() {}

  save() {
    if (!this.form.date) { this.error = 'La fecha es requerida'; return; }
    if (this.form.weight < 0 || this.form.dose < 0) {
      this.error = 'Los valores no pueden ser negativos'; return;
    }

    const d = new Date(this.form.date);
    const fechaStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    this.despService.create({
      ...this.form,
      date: fechaStr,
      mascota_FK: this.data.mascotaId
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.error = 'Error al guardar'
    });
  }
  bloquearNegativo(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
  

  close() { this.dialogRef.close(); }
}
