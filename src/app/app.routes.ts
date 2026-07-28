import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', title: 'Iniciar sesión',loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: '', canActivate: [authGuard], children: [
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      { path: 'clientes', title: 'Veterinaria Huancayo',loadComponent: () => import('./pages/clientes/clientes.component').then(m => m.ClientesComponent) },
      { path: 'mascotas', title: 'Veterinaria Huancayo',loadComponent: () => import('./pages/mascotas/mascotas.component').then(m => m.MascotasComponent) },
      { path: 'citas', title: 'Veterinaria Huancayo',loadComponent: () => import('./pages/citas/citas.component').then(m => m.CitasComponent) },
      { path: 'mascotas/:id', title: 'Perfil de mascota', canActivate: [authGuard], loadComponent: () => import('./pages/mascotas/mascota-perfil/mascota-perfil.component').then(m => m.MascotaPerfilComponent) },
      { path: 'registro', title: 'Registrar mascota', canActivate: [authGuard], loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent) },
      { path: 'mascotas/:id/medico', title: 'Ficha medica', canActivate: [authGuard], loadComponent: () => import('./pages/mascotas/ficha-medica/ficha-medica.component').then(m => m.FichaMedicaComponent) },
      { path: 'mascotas/:id/grooming', title: 'Grooming', canActivate: [authGuard], loadComponent: () => import('./pages/mascotas/ficha-grooming/ficha-grooming.component').then(m => m.FichaGroomingComponent) },
  ]},
  { path: '**', redirectTo: 'login' }
];
