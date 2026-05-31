import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportSummary } from './report.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/api/reports`;

  constructor(private http: HttpClient) {}

  getSummary(from: string, to: string): Observable<ReportSummary> {
    return this.http.get<ReportSummary>(`${this.apiUrl}/summary?from=${from}&to=${to}`);
  }
}
