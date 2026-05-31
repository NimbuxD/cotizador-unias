import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quotation, CreateQuotationDto, DashboardStats } from './quotation.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuotationsService {
  private apiUrl = `${environment.apiUrl}/api/quotations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Quotation[]> {
    return this.http.get<Quotation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Quotation> {
    return this.http.get<Quotation>(`${this.apiUrl}/${id}`);
  }

  create(quotation: CreateQuotationDto): Observable<Quotation> {
    return this.http.post<Quotation>(this.apiUrl, quotation);
  }

  update(id: number, quotation: Partial<CreateQuotationDto>): Observable<Quotation> {
    return this.http.put<Quotation>(`${this.apiUrl}/${id}`, quotation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/api/dashboard/stats`);
  }
}
