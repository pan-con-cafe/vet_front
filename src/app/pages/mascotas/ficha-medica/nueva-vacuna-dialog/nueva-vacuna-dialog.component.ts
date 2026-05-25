import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { VacunaService } from '../../../../core/services/vacuna.service';
import { TypeVacunaService } from '../../../../core/services/type-vacuna.service';

@Component({
  selector: 'app-nueva-vacuna-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './nueva-vacuna-dialog.component.html',
  styleUrl: './nueva-vacuna-dialog.component.scss'
})
export class NuevaVacunaDialogComponent implements OnInit {
  tipos: any[] = [];
  form: any = { typeVacuna_FK: null, date: '', weight: null, temperature: null };
  error = '';

  constructor(
    private dialogRef: MatDialogRef<NuevaVacunaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vacunaService: VacunaService,
    private typeVacunaService: TypeVacunaService
  ) {}

  ngOnInit() {
    this.typeVacunaService.getAll().subscribe(d => this.tipos = d);
  }

  save() {
    if (!this.form.typeVacuna_FK || !this.form.date) {
      this.error = 'Tipo y fecha son requeridos'; return;
    }
    this.vacunaService.create({ ...this.form, mascota_FK: this.data.mascotaId }).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.error = 'Error al guardar'
    });
  }

  close() { this.dialogRef.close(); }
}
