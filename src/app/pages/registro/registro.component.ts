import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MascotaService } from '../../core/services/mascota.service';
import { ClienteService } from '../../core/services/cliente.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent implements OnInit {

  imagenFile: File | null = null;
  imagenPreview: SafeUrl | null = null;
  subiendoImagen = false;
  guardando = false;
  maxDate = new Date();
  hoy = new Date().toISOString().split('T')[0];
  mascotaId: number | null = null;
  modoEdicion = false;

  mascota: any = {
    name: '', race: '', color: '', birth_date: '',
    gender: null, species: null, feature: '', clienteIds: []
  };

  propietarios: any[] = [this.nuevoPropietario()];
  clientesExistentes: any[] = [];
  error = '';

  constructor(
    private mascotaService: MascotaService,
    private clienteService: ClienteService,
    private cloudinaryService: CloudinaryService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.clienteService.getAll().subscribe(data => this.clientesExistentes = data);

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.mascotaId = +id;
      this.modoEdicion = true;
      this.mascotaService.getById(this.mascotaId).subscribe(data => {
        this.mascota = {
          name: data.name,
          race: data.race,
          color: data.color,
          birth_date: data.birth_date ? new Date(data.birth_date) : null,
          gender: data.gender,
          species: data.species,
          feature: data.feature,
          image: data.image
        };

        if (data.image) {
          this.imagenPreview = this.sanitizer.bypassSecurityTrustUrl(data.image);
        }

        this.propietarios = data.propietarios?.map((p: any) => ({
          clienteId: p.idCliente,
          nameLastname: p.nameLastname,
          address: p.address,
          telefonos: p.telefonos?.length ? [...p.telefonos] : [''],
          showSuggestions: false
        })) ?? [this.nuevoPropietario()];
      });
    }
  }

  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.imagenFile = file;
    const objectUrl = URL.createObjectURL(file);
    this.imagenPreview = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }

  nuevoPropietario() {
    return { nameLastname: '', address: '', telefonos: [''], clienteId: null, showSuggestions: false };
  }

  addPropietario() { this.propietarios.push(this.nuevoPropietario()); }
  removePropietario(i: number) { this.propietarios.splice(i, 1); }
  addTel(i: number) { this.propietarios[i].telefonos.push(''); }
  removeTel(i: number, j: number) { this.propietarios[i].telefonos.splice(j, 1); }

  onNombreChange(i: number) {
    this.propietarios[i].clienteId = null;
    this.propietarios[i].showSuggestions = true;
  }

  onBlur(i: number) {
    setTimeout(() => this.propietarios[i].showSuggestions = false, 150);
  }

  getSuggestions(i: number): any[] {
    const q = this.propietarios[i].nameLastname?.toLowerCase();
    if (!q || q.length < 2) return [];
    return this.clientesExistentes.filter(c =>
      c.nameLastname?.toLowerCase().includes(q)
    ).slice(0, 5);
  }

  filtrarTelefono(event: Event, i: number, j: number) {
    const input = event.target as HTMLInputElement;
    const soloNumeros = input.value.replace(/[^0-9\s\+\-]/g, '');
    input.value = soloNumeros;
    this.propietarios[i].telefonos[j] = soloNumeros;
  }

  trackByIndex(index: number): number {
    return index;
  }

  selectCliente(i: number, cliente: any) {
    this.propietarios[i].clienteId = cliente.idCliente;
    this.propietarios[i].nameLastname = cliente.nameLastname;
    this.propietarios[i].address = cliente.address;
    this.propietarios[i].telefonos = cliente.telefonos?.length ? [...cliente.telefonos] : [''];
    this.propietarios[i].showSuggestions = false;
  }

  puedeGuardar(): boolean {
    const fechaValida = !this.mascota.birth_date || this.mascota.birth_date <= this.hoy;
    return !!this.mascota.name && this.mascota.gender !== null &&
           this.mascota.species !== null && this.propietarios[0].nameLastname.trim() !== '';
  }

  async guardar() {
    this.error = '';
    this.subiendoImagen = false;
    this.guardando = true;

    try {
      // 1. Primero subir imagen a Cloudinary y esperar la URL
      if (this.imagenFile) {
        this.subiendoImagen = true;
        const res: any = await this.cloudinaryService.upload(this.imagenFile).toPromise();
        this.mascota.image = res.secure_url;
        this.subiendoImagen = false;
      }

      // 3. Crear clientes
      const clienteIds: number[] = [];
      for (const p of this.propietarios) {
        if (p.clienteId) {
          clienteIds.push(p.clienteId);
        } else {
          const payload = {
            nameLastname: p.nameLastname,
            address: p.address,
            telefonos: p.telefonos.filter((t: string) => t.trim())
          };
          const res: any = await this.clienteService.create(payload).toPromise();
          clienteIds.push(res.idCliente);
        }
      }

      const d = new Date(this.mascota.birth_date);
      const birthDate = this.mascota.birth_date
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        : null;

      // 4. Crear mascota con la URL de Cloudinary
      const mascotaPayload = {
        name: this.mascota.name,
        race: this.mascota.race,
        color: this.mascota.color,
        birth_date: birthDate,
        gender: this.mascota.gender,
        species: this.mascota.species,
        feature: this.mascota.feature,
        image: this.mascota.image || null,
        clienteIds
      };

      if (this.modoEdicion && this.mascotaId) {
        await this.mascotaService.update(this.mascotaId, mascotaPayload).toPromise();
        this.router.navigate(['/mascotas', this.mascotaId]);
      } else {
        await this.mascotaService.create(mascotaPayload).toPromise();
        this.router.navigate(['/mascotas']);
      }

    } catch (err) {
      this.subiendoImagen = false;
      console.error('Error en guardar:', err);
      this.error = 'Error al guardar, revisa los datos e intenta de nuevo';
    } finally {
      this.guardando = false;
    }
  }

  cancelar() { this.router.navigate(['/mascotas']); }
}
