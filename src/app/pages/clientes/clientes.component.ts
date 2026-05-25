import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ClienteService } from '../../core/services/cliente.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})

export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  search = '';

  constructor(
    public router: Router,
    private clienteService: ClienteService,
    private dialog: MatDialog
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.clienteService.getAll().subscribe(data => this.clientes = data);
  }

  filtrados() {
    const q = this.search.toLowerCase();
    return this.clientes.filter(c =>
      c.nameLastname?.toLowerCase().includes(q) ||
      c.address?.toLowerCase().includes(q)
    );
  }

  /*openForm(cliente?: any) {
    const ref = this.dialog.open(ClienteFormDialogComponent, {
      width: '480px',
      data: cliente ?? null
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }*/

  getMascotas(cliente: any): string {
    return cliente.mascotas?.map((m: any) => m.name).join(', ') ?? '';
  }
}
