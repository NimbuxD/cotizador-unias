import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NailService, CreateNailServiceDto } from './nail-service.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private apiUrl = `${environment.apiUrl}/api/services`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<NailService[]> {
    return this.http.get<NailService[]>(this.apiUrl);
  }

  getById(id: number): Observable<NailService> {
    return this.http.get<NailService>(`${this.apiUrl}/${id}`);
  }

  create(service: CreateNailServiceDto): Observable<NailService> {
    return this.http.post<NailService>(this.apiUrl, service);
  }

  update(id: number, service: Partial<CreateNailServiceDto>): Observable<NailService> {
    return this.http.put<NailService>(`${this.apiUrl}/${id}`, service);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addMaterial(serviceId: number, dto: { productId: number; quantityUsed: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${serviceId}/materials`, dto);
  }

  updateMaterial(serviceId: number, materialId: number, dto: { productId: number; quantityUsed: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${serviceId}/materials/${materialId}`, dto);
  }

  deleteMaterial(serviceId: number, materialId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${serviceId}/materials/${materialId}`);
  }
}
