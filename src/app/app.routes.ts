import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: '', canActivate: [authGuard], children: [
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      { path: 'clientes', loadComponent: () => import('./pages/clientes/clientes.component').then(m => m.ClientesComponent) },
      { path: 'mascotas', loadComponent: () => import('./pages/mascotas/mascotas.component').then(m => m.MascotasComponent) },
      { path: 'citas', loadComponent: () => import('./pages/citas/citas.component').then(m => m.CitasComponent) },
      { path: 'mascotas/:id', canActivate: [authGuard], loadComponent: () => import('./pages/mascotas/mascota-perfil/mascota-perfil.component').then(m => m.MascotaPerfilComponent) },
      { path: 'registro', canActivate: [authGuard], loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent) },
      { path: 'mascotas/:id/medico', canActivate: [authGuard], loadComponent: () => import('./pages/mascotas/ficha-medica/ficha-medica.component').then(m => m.FichaMedicaComponent) },
      { path: 'mascotas/:id/grooming', canActivate: [authGuard], loadComponent: () => import('./pages/mascotas/ficha-grooming/ficha-grooming.component').then(m => m.FichaGroomingComponent) },
  ]},
  { path: '**', redirectTo: 'login' }
];
