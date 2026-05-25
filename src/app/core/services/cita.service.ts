import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private url = `${environment.apiUrl}/cita`;
  constructor(private http: HttpClient) { }

  getAll() { return this.http.get<any[]>(this.url); }
  getById(id: number) { return this.http.get<any>(`${this.url}/${id}`); }
  create(data: any) { return this.http.post(this.url, data); }
  update(id: number, data: any) { return this.http.put(`${this.url}/${id}`, data, { responseType: 'text' }); }
  updateStatus(id: number, status: string) { return this.http.patch(`${this.url}/${id}/status`, JSON.stringify(status), { headers: { 'Content-Type': 'application/json' } }); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
}
