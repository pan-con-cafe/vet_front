import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MascotaService } from '../../core/services/mascota.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-mascotas',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './mascotas.component.html',
  styleUrl: './mascotas.component.scss'
})
export class MascotasComponent implements OnInit {
  mascotas: any[] = [];
  search = '';

  constructor(
    public router: Router,
    private mascotaService: MascotaService
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.mascotaService.getAll().subscribe(data => this.mascotas = data);
  }

  filtradas() {
    const q = this.search.toLowerCase();
    return this.mascotas.filter(m =>
      m.name?.toLowerCase().includes(q) ||
      m.race?.toLowerCase().includes(q)
    );
  }

}
