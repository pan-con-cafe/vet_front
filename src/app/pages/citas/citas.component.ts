import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CitaService } from '../../core/services/cita.service';
import { NuevaCitaDialogComponent } from './nueva-cita-dialog/nueva-cita-dialog.component';
import { ReprogramarCitaDialogComponent } from './reprogramar-cita-dialog/reprogramar-cita-dialog.component';
import { CancelarCitaDialogComponent } from './cancelar-cita-dialog/cancelar-cita-dialog.component';
import { NuevaVacunaDialogComponent } from '../mascotas/ficha-medica/nueva-vacuna-dialog/nueva-vacuna-dialog.component';
import { NuevaDespDialogComponent } from '../mascotas/ficha-medica/nueva-desp-dialog/nueva-desp-dialog.component';
import { NuevaCirugiaDialogComponent } from '../mascotas/ficha-medica/nueva-cirugia-dialog/nueva-cirugia-dialog.component';
import { NuevoGroomingDialogComponent } from '../mascotas/ficha-grooming/nuevo-grooming-dialog/nuevo-grooming-dialog.component';

@Component({
  selector: 'app-citas',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss'
})
export class CitasComponent implements OnInit{
  citas: any[] = [];
  hoy = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  fechaHoy = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  constructor(
    private citaService: CitaService,
    private dialog: MatDialog
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.citaService.getAll().subscribe(data => this.citas = data);
  }

  get citasHoy() {
    return this.citas.filter(c => 
      c.date === this.fechaHoy && c.status === 'pendiente'
    );
  }

  get citasFuturas() {
    return this.citas.filter(c => 
      c.date > this.fechaHoy && c.status === 'pendiente'
    );
  }

  formatFecha(date: string): string {
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  }

  nuevaCita() {
    const ref = this.dialog.open(NuevaCitaDialogComponent, { width: '420px' });
    ref.afterClosed().subscribe(result => { if (result) this.load(); });
  }

  reprogramar(cita: any) {
    const ref = this.dialog.open(ReprogramarCitaDialogComponent, {
      width: '380px',
      data: cita
    });
    ref.afterClosed().subscribe(result => { if (result) this.load(); });
  }

  cancelar(cita: any) {
    const ref = this.dialog.open(CancelarCitaDialogComponent, {
      width: '340px',
      data: cita
    });
    ref.afterClosed().subscribe(result => { if (result) this.load(); });
  }

  editar(cita: any) {
    const tipo = cita.tipo?.toLowerCase();
    let dialogComponent: any;
    let dialogData: any;

    if (tipo.includes('vacuna')) {
      dialogComponent = NuevaVacunaDialogComponent;
      dialogData = { mascotaId: cita.mascota.idMascota };
    } else if (tipo.includes('grooming')) {
      dialogComponent = NuevoGroomingDialogComponent;
      dialogData = { mascotaId: cita.mascota.idMascota, mascotaNombre: cita.mascota.name, grooming: null };
    } else if (tipo.includes('desparacitacion') || tipo.includes('desparasitacion')) {
      dialogComponent = NuevaDespDialogComponent;
      dialogData = { mascotaId: cita.mascota.idMascota };
    } else if (tipo.includes('cirugia') || tipo.includes('cirugía')) {
      dialogComponent = NuevaCirugiaDialogComponent;
      dialogData = { mascotaId: cita.mascota.idMascota };
    } else {
      return;
    }

    const ref = this.dialog.open(dialogComponent, {
      width: '480px',
      data: dialogData
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        // Marcar cita como atendida
        this.citaService.updateStatus(cita.idCita, 'atendida').subscribe({
          next: () => this.load(),
          error: () => this.load()
        });
      }
    });
  }
}
