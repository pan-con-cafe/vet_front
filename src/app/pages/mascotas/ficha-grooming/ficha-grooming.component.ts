import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MascotaService } from '../../../core/services/mascota.service';
import { NuevoGroomingDialogComponent } from './nuevo-grooming-dialog/nuevo-grooming-dialog.component';

@Component({
  selector: 'app-ficha-grooming',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './ficha-grooming.component.html',
  styleUrl: './ficha-grooming.component.scss'
})
export class FichaGroomingComponent implements OnInit {
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

  formatFecha(date: string): string {
    if (!date) return '—';
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  }

  nuevoGrooming() {
    const ref = this.dialog.open(NuevoGroomingDialogComponent, {
      width: '480px',
      data: { mascotaId: this.mascotaId, mascotaNombre: this.mascota.name, grooming: null }
    });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  editarGrooming(g: any) {
    const ref = this.dialog.open(NuevoGroomingDialogComponent, {
      width: '480px',
      data: { mascotaId: this.mascotaId, mascotaNombre: this.mascota.name, grooming: g }
    });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }
}
