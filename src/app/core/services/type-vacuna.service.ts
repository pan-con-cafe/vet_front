import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeVacunaService {
  private url = `${environment.apiUrl}/typevacuna`;
  constructor(private http: HttpClient) { }

  getAll() { return this.http.get<any[]>(this.url); }
}
