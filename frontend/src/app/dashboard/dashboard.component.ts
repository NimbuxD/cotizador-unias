import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductsService } from '../products/products.service';
import { ServicesService } from '../services/services.service';
import { QuotationsService } from '../quotations/quotations.service';
import { Product } from '../products/product.model';
import { NailService } from '../services/nail-service.model';
import { Quotation } from '../quotations/quotation.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatBadgeModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  loading = true;
  totalProducts = 0;
  lowStockProducts: Product[] = [];
  totalServices = 0;
  todayQuotations = 0;
  pendingQuotations = 0;
  recentQuotations: Quotation[] = [];

  constructor(
    private productsService: ProductsService,
    private servicesService: ServicesService,
    private quotationsService: QuotationsService
  ) {}

  ngOnInit(): void {
    forkJoin({
      products: this.productsService.getAll().pipe(catchError(() => of([]))),
      services: this.servicesService.getAll().pipe(catchError(() => of([]))),
      quotations: this.quotationsService.getAll().pipe(catchError(() => of([])))
    }).subscribe(({ products, services, quotations }) => {
      this.totalProducts = products.length;
      this.lowStockProducts = products.filter((p: Product) => p.stock <= p.minStock);
      this.totalServices = services.length;

      const today = new Date().toDateString();
      this.todayQuotations = quotations.filter((q: Quotation) => {
        if (!q.createdAt) return false;
        return new Date(q.createdAt).toDateString() === today;
      }).length;

      this.pendingQuotations = quotations.filter((q: Quotation) => q.status === 'pending').length;
      this.recentQuotations = quotations.slice(-5).reverse();
      this.loading = false;
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      completed: 'Completado'
    };
    return labels[status] || status;
  }
}
