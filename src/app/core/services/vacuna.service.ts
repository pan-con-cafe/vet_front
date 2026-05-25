import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacunaService {
  private url = `${environment.apiUrl}/vacuna`;
  constructor(private http: HttpClient) { }

  getByMascota(mascotaId: number) { return this.http.get<any[]>(`${this.url}/mascota/${mascotaId}`); }
  getById(id: number) { return this.http.get<any>(`${this.url}/${id}`); }
  create(data: any) { return this.http.post(this.url, data); }
  update(id: number, data: any) { return this.http.put(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`); }
}
