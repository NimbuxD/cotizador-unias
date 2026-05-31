import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { QuotationsService } from '../quotations.service';
import { Quotation, QuotationStatus } from '../quotation.model';

@Component({
  selector: 'app-quotations-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './quotations-list.component.html',
  styleUrl: './quotations-list.component.scss'
})
export class QuotationsListComponent implements OnInit {
  quotations: Quotation[] = [];
  filteredQuotations: Quotation[] = [];
  displayedColumns = ['id', 'clientName', 'services', 'totalCost', 'status', 'createdAt', 'actions'];
  loading = true;
  searchTerm = '';
  statusFilter = '';

  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'rejected', label: 'Rechazado' },
    { value: 'completed', label: 'Completado' }
  ];

  constructor(
    private quotationsService: QuotationsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadQuotations();
  }

  loadQuotations(): void {
    this.loading = true;
    this.quotationsService.getAll().subscribe({
      next: (quotations) => {
        this.quotations = quotations;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar las cotizaciones', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    let result = [...this.quotations];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(q =>
        q.clientName.toLowerCase().includes(term) ||
        (q.clientEmail && q.clientEmail.toLowerCase().includes(term)) ||
        (q.clientPhone && q.clientPhone.includes(term))
      );
    }
    if (this.statusFilter) {
      result = result.filter(q => q.status === this.statusFilter);
    }
    this.filteredQuotations = result;
  }

  getStatusLabel(status: QuotationStatus): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      completed: 'Completado'
    };
    return labels[status] || status;
  }

  markAsCompleted(q: Quotation): void {
    this.quotationsService.update(q.id, { status: 'completed' }).subscribe({
      next: () => {
        this.snackBar.open('Cotización marcada como completada', 'Cerrar', { duration: 3000 });
        this.loadQuotations();
      },
      error: () => {
        this.snackBar.open('Error al actualizar la cotización', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteQuotation(q: Quotation): void {
    if (confirm(`¿Eliminar la cotización de "${q.clientName}"?`)) {
      this.quotationsService.delete(q.id).subscribe({
        next: () => {
          this.snackBar.open('Cotización eliminada', 'Cerrar', { duration: 3000 });
          this.loadQuotations();
        },
        error: () => {
          this.snackBar.open('Error al eliminar la cotización', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
