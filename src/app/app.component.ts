import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';
import { CommonModule, AsyncPipe } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  mostrarNavbar = true;

  private rutasSinNavbar = [
    '/mascotas/',
    '/registro',
    '/login'
  ];

  title = 'vet-front-provisional';

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.mostrarNavbar = !this.rutasSinNavbar.some(r => e.urlAfterRedirects.includes(r));
    });
  }
}
