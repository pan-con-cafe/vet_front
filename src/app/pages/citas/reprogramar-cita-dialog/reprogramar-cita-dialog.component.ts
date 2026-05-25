import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CitaService } from '../../../core/services/cita.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-reprogramar-cita-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './reprogramar-cita-dialog.component.html',
  styleUrl: './reprogramar-cita-dialog.component.scss'
})
export class ReprogramarCitaDialogComponent implements OnInit{
  nuevaFecha: any = null;
  minDate = new Date();
  hoy = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  error = '';

  constructor(
    private dialogRef: MatDialogRef<ReprogramarCitaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private citaService: CitaService
  ) {}

  ngOnInit() {
    // Convertir la fecha string a Date para el datepicker
    if (this.data.date) {
      const [y, m, d] = this.data.date.split('-');
      this.nuevaFecha = new Date(+y, +m - 1, +d);
    }
  }

  formatearFechaLocal(fecha: any): string {
    const d = new Date(fecha);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  save() {
    if (!this.nuevaFecha) { this.error = 'Selecciona una fecha'; return; }
    const d = new Date(this.nuevaFecha);
    const fecha = this.formatearFechaLocal(this.nuevaFecha);

    if (fecha < this.hoy) {
      this.error = 'No se pueden reprogramar citas a fechas pasadas';
      return;
    }
    const payload = {
      mascota_FK: this.data.mascota.idMascota,
      typeCita_FK: this.data.typeCita_FK,
      date: fecha,
      status: this.data.status
    };
    
    this.citaService.update(this.data.idCita, payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.error = 'Error al reprogramar'
    });
  }

  close() { this.dialogRef.close(); }

}