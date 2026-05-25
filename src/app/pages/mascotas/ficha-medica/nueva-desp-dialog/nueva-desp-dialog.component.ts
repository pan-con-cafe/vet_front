import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DesparacitacionService } from '../../../../core/services/desparacitacion.service';

@Component({
  selector: 'app-nueva-desp-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './nueva-desp-dialog.component.html',
  styleUrl: './nueva-desp-dialog.component.scss'
})
export class NuevaDespDialogComponent implements OnInit{
  form: any = { product: '', date: '', weight: null, dose: null };
  error = '';

  constructor(
    private dialogRef: MatDialogRef<NuevaDespDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private despService: DesparacitacionService
  ) {}

  ngOnInit() {}

  save() {
    if (!this.form.date) { this.error = 'La fecha es requerida'; return; }
    this.despService.create({ ...this.form, mascota_FK: this.data.mascotaId }).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.error = 'Error al guardar'
    });
  }

  close() { this.dialogRef.close(); }
}
