import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(this.hayTokenValido());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.hayTokenValido();
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  private hayTokenValido(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    if (this.estaExpirado(token)) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  }

  private estaExpirado(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false; // si no trae exp, no lo tratamos como expirado
      const ahoraEnSegundos = Math.floor(Date.now() / 1000);
      return payload.exp < ahoraEnSegundos;
    } catch {
      return true; // token corrupto/malformado = tratarlo como inválido
    }
  }
}