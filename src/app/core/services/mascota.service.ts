import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private url = `${environment.apiUrl}/mascota`;
  constructor(private http: HttpClient) { }

  getAll() { return this.http.get<any[]>(this.url); }
  getById(id: number) { return this.http.get<any>(`${this.url}/${id}`); }
  create(data: any) { return this.http.post(this.url, data); }
  update(id: number, data: any) { return this.http.put(`${this.url}/${id}`, data, { responseType: 'text' }); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`); }
}
