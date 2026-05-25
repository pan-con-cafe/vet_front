import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CitaService } from '../../../core/services/cita.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { TypeCitaService } from '../../../core/services/type-cita.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-nueva-cita-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './nueva-cita-dialog.component.html',
  styleUrl: './nueva-cita-dialog.component.scss'
})
export class NuevaCitaDialogComponent implements OnInit {
  mascotas: any[] = [];
  tipos: any[] = [];
  minDate = new Date();
  hoy = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  form = { mascota_FK: null, typeCita_FK: null, date: '' };
  error = '';

  constructor(
    private dialogRef: MatDialogRef<NuevaCitaDialogComponent>,
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private typeCitaService: TypeCitaService
  ) {}

  ngOnInit() {
    this.mascotaService.getAll().subscribe(data => this.mascotas = data);
    this.typeCitaService.getAll().subscribe(data => this.tipos = data);
  }

  formatearFechaLocal(fecha: any): string {
    const d = new Date(fecha);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  save() {
    if (!this.form.mascota_FK || !this.form.typeCita_FK || !this.form.date) {
      this.error = 'Todos los campos son requeridos';
      return;
    }

    const d = new Date(this.form.date);
    const fecha = this.formatearFechaLocal(this.form.date);

    if (fecha < this.hoy) {
      this.error = 'No se pueden registrar citas en fechas pasadas';
      return;
    }

    this.citaService.create({...this.form, date: fecha}).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.error = 'Error al guardar'
    });
  }

  close() { this.dialogRef.close(); }
}
