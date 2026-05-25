import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../../core/services/mascota.service';

@Component({
  selector: 'app-mascota-perfil',
  imports: [CommonModule],
  templateUrl: './mascota-perfil.component.html',
  styleUrl: './mascota-perfil.component.scss'
})
export class MascotaPerfilComponent implements OnInit {
  mascota: any = null;
  propIndex = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private mascotaService: MascotaService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mascotaService.getById(+id).subscribe(data => this.mascota = data);
    }
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

  propActual() {
    return this.mascota.propietarios?.[this.propIndex];
  }

  prevProp() { if (this.propIndex > 0) this.propIndex--; }
  nextProp() {
    if (this.propIndex < this.mascota.propietarios.length - 1) this.propIndex++;
  }

  ultimasVacunas() {
    return this.mascota.vacunas?.slice(-3).reverse() ?? [];
  }

  ultimaDesp() {
    const desps = this.mascota.desparacitaciones;
    if (!desps?.length) return null;
    return desps[desps.length - 1];
  }

  ultimoGrooming() {
    const groomings = this.mascota.groomings;
    if (!groomings?.length) return null;
    return groomings[groomings.length - 1];
  }

  formatFecha(date: string): string {
    if (!date) return '—';
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  }

  editar() {
    this.router.navigate(['/registro'], {
      queryParams: { id: this.mascota.idMascota }
    });
  }
}
