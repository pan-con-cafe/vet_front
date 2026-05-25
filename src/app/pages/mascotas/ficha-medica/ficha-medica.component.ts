import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MascotaService } from '../../../core/services/mascota.service';
import { NuevaVacunaDialogComponent } from './nueva-vacuna-dialog/nueva-vacuna-dialog.component';
import { NuevaDespDialogComponent } from './nueva-desp-dialog/nueva-desp-dialog.component';
import { NuevaCirugiaDialogComponent } from './nueva-cirugia-dialog/nueva-cirugia-dialog.component';
import { VerTodoDialogComponent } from './ver-todo-dialog/ver-todo-dialog.component';

@Component({
  selector: 'app-ficha-medica',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './ficha-medica.component.html',
  styleUrl: './ficha-medica.component.scss'
})
export class FichaMedicaComponent implements OnInit {
  mascota: any = null;
  mascotaId!: number;
  propIndex = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private mascotaService: MascotaService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.mascotaId = +this.route.snapshot.paramMap.get('id')!;
    this.load();
  }

  load() {
    this.mascotaService.getById(this.mascotaId).subscribe(data => this.mascota = data);
  }

  calcularEdad(): number {
    if (!this.mascota?.birth_date) return 0;
    const hoy = new Date();
    const nac = new Date(this.mascota.birth_date);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  }

  propActual() { return this.mascota.propietarios?.[this.propIndex]; }
  prevProp() { if (this.propIndex > 0) this.propIndex--; }
  nextProp() {
    if (this.propIndex < this.mascota.propietarios.length - 1) this.propIndex++;
  }

  ultimas(lista: any[], n: number) {
    if (!lista?.length) return [];
    return lista.slice(-n).reverse();
  }

  formatFecha(date: string): string {
    if (!date) return '—';
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  }

  nuevaVacuna() {
    const ref = this.dialog.open(NuevaVacunaDialogComponent, {
      width: '420px', data: { mascotaId: this.mascotaId }
    });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  nuevaDesp() {
    const ref = this.dialog.open(NuevaDespDialogComponent, {
      width: '420px', data: { mascotaId: this.mascotaId }
    });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  nuevaCirugia() {
    const ref = this.dialog.open(NuevaCirugiaDialogComponent, {
      width: '420px', data: { mascotaId: this.mascotaId }
    });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  verTodo(tipo: string) {
    const datos = tipo === 'vacunas' ? this.mascota.vacunas
      : tipo === 'desparacitaciones' ? this.mascota.desparacitaciones
      : this.mascota.cirugias;
    this.dialog.open(VerTodoDialogComponent, {
      width: '600px', data: { tipo, datos }
    });
  }
}
