import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GroomingService } from '../../../../core/services/grooming.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-nuevo-grooming-dialog',
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './nuevo-grooming-dialog.component.html',
  styleUrl: './nuevo-grooming-dialog.component.scss'
})
export class NuevoGroomingDialogComponent implements OnInit {
  form: any = {
    date: null, entry: null, exit: null,
    haircut: '', amount: null, onCredit: null, residue: null
  };
  minDate = new Date();
  hoy = new Date().toISOString().split('T')[0];
  error = '';

  // Horas disponibles en intervalos de 30 minutos
  horas: string[] = Array.from({ length: 48 }, (_, i) => {
    const h = String(Math.floor(i / 2)).padStart(2, '0');
    const m = i % 2 === 0 ? '00' : '30';
    return `${h}:${m}`;
  });

  constructor(
    private dialogRef: MatDialogRef<NuevoGroomingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groomingService: GroomingService
  ) {}

  ngOnInit() {
    if (this.data.grooming) {
      const g = this.data.grooming;
      // ✅ Fix: convertir string a Date para que el datepicker lo entienda
      const [y, m, d] = g.date.split('-');
      this.form = {
        date: new Date(+y, +m - 1, +d),
        entry: g.entry ? g.entry.substring(0, 5) : null,
        exit: g.exit ? g.exit.substring(0, 5) : null,
        haircut: g.haircut,
        amount: g.amount,
        onCredit: g.onCredit,
        residue: g.residue
      };
    }
  }

  usarHoraActual(campo: 'entry' | 'exit') {
    const ahora = new Date();
    const h = String(ahora.getHours()).padStart(2, '0');
    const m = ahora.getMinutes() < 30 ? '00' : '30';
    this.form[campo] = `${h}:${m}`;
  }

  // ✅ Bloquear 'e', 'E', '+', '-' en inputs numéricos
  bloquearCaracteres(event: KeyboardEvent) {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }

  save() {
    if (!this.form.date) { this.error = 'La fecha es requerida'; return; }

    // ✅ Fix: construir fecha primero para poder validarla antes del payload
    const d = new Date(this.form.date);
    const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    if (fecha < this.hoy) {
      this.error = 'No se pueden registrar citas en fechas pasadas';
      return;
    }

    const payload = {
      ...this.form,
      date: fecha,
      mascota_FK: this.data.mascotaId,
      entry: this.form.entry ? `${this.form.entry}:00` : null,
      exit: this.form.exit ? `${this.form.exit}:00` : null
    };

    const request = this.data.grooming
      ? this.groomingService.update(this.data.grooming.idGrooming, payload)
      : this.groomingService.create(payload);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.error = 'Error al guardar'
    });
  }

  close() { this.dialogRef.close(); }
}