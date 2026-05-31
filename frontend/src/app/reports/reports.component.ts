import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import * as XLSX from 'xlsx';
import { ReportsService } from './reports.service';
import { ReportSummary } from './report.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  fromDate: string = '';
  toDate: string = '';
  summary: ReportSummary | null = null;
  loading = false;

  byServiceColumns = ['serviceName', 'count', 'revenue', 'materialCost', 'profit'];
  detailColumns = ['clientName', 'date', 'services', 'totalMaterialCost', 'finalPrice', 'profit'];

  constructor(
    private reportsService: ReportsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Default to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.fromDate = this.formatDate(firstDay);
    this.toDate = this.formatDate(now);
    this.loadReport();
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  loadReport(): void {
    if (!this.fromDate || !this.toDate) return;
    this.loading = true;
    this.reportsService.getSummary(this.fromDate, this.toDate).subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar el reporte', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  exportToExcel(): void {
    if (!this.summary) return;
    const wb = XLSX.utils.book_new();

    // Sheet 1: by service
    const ws1 = XLSX.utils.json_to_sheet(this.summary.byService.map(s => ({
      'Servicio': s.serviceName,
      'Cantidad': s.count,
      'Ingresos': s.revenue,
      'Costo Materiales': s.materialCost,
      'Ganancia': s.profit,
    })));
    XLSX.utils.book_append_sheet(wb, ws1, 'Por Servicio');

    // Sheet 2: detail
    const ws2 = XLSX.utils.json_to_sheet(this.summary.quotations.map(q => ({
      'Cliente': q.clientName,
      'Fecha': q.date,
      'Servicios': q.services.join(', '),
      'Costo Material': q.totalMaterialCost,
      'Precio Final': q.finalPrice,
      'Ganancia': q.profit,
    })));
    XLSX.utils.book_append_sheet(wb, ws2, 'Detalle');

    XLSX.writeFile(wb, `reporte-${this.fromDate}-${this.toDate}.xlsx`);
  }
}
