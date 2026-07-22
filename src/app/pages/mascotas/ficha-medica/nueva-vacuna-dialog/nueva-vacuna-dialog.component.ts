import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { VacunaService } from '../../../../core/services/vacuna.service';
import { TypeVacunaService } from '../../../../core/services/type-vacuna.service';

@Component({
  selector: 'app-nueva-vacuna-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './nueva-vacuna-dialog.component.html',
  styleUrl: './nueva-vacuna-dialog.component.scss'
})
export class NuevaVacunaDialogComponent implements OnInit {
  tipos: any[] = [];
  form: any = { typeVacuna_FK: null, date: '', weight: null, temperature: null };
  error = '';
  maxDate = new Date();

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

    if (this.form.weight < 0 || this.form.temperature < 0) {
      this.error = 'Los valores no pueden ser negativos'; return;
    }
    const d = new Date(this.form.date);
    const fechaStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    this.vacunaService.create({
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
