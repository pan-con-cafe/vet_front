import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private url = `${environment.apiUrl}/cliente`;
  constructor(private http: HttpClient) { }

  getAll() { return this.http.get<any[]>(this.url); }
  getById(id: number) { return this.http.get<any>(`${this.url}/${id}`); }
  create(data: any) { return this.http.post<any>(this.url, data); }
  update(id: number, data: any) { return this.http.put(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`); }
}
