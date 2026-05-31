import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { QuotationsService } from '../quotations.service';
import { Quotation, QuotationStatus } from '../quotation.model';

@Component({
  selector: 'app-quotation-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './quotation-detail.component.html',
  styleUrl: './quotation-detail.component.scss'
})
export class QuotationDetailComponent implements OnInit {
  quotation: Quotation | null = null;
  loading = true;
  servicesColumns = ['service', 'qty', 'unitPrice', 'subtotal'];

  constructor(
    private quotationsService: QuotationsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.quotationsService.getById(id).subscribe({
      next: (q) => {
        this.quotation = q;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar la cotización', 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/quotations']);
      }
    });
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

  getTotalCost(): number {
    if (!this.quotation?.services) return 0;
    return this.quotation.services.reduce((sum, s) => sum + ((s.unitPrice ?? 0) * s.quantity), 0);
  }

  deleteQuotation(): void {
    if (!this.quotation) return;
    if (confirm(`¿Eliminar la cotización de "${this.quotation.clientName}"?`)) {
      this.quotationsService.delete(this.quotation.id).subscribe({
        next: () => {
          this.snackBar.open('Cotización eliminada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/quotations']);
        },
        error: () => {
          this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
