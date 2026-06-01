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
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './quotation-detail.component.html',
  styleUrl: './quotation-detail.component.scss'
})
export class QuotationDetailComponent implements OnInit {
  quotation: Quotation | null = null;
  loading = true;
  servicesColumns = ['service', 'qty', 'unitPrice', 'subtotal'];
  extrasColumns = ['name', 'cost'];

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
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      completed: 'Completado'
    };
    return labels[status] || status;
  }

  getTotalCost(): number {
    return Number(this.quotation?.finalPrice) || Number(this.quotation?.totalMaterialCost) || 0;
  }

  getExtrasTotalCost(): number {
    return (this.quotation?.extras || []).reduce((sum, e) => sum + (e.cost || 0), 0);
  }

  registerArrival(): void {
    if (!this.quotation) return;
    this.quotationsService.arrive(this.quotation.id).subscribe({
      next: (updated) => {
        this.quotation = updated;
        this.snackBar.open('Llegada registrada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error al registrar llegada', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.quotation) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      this.quotationsService.addPhoto(this.quotation!.id, base64).subscribe({
        next: (updated) => {
          this.quotation = updated;
          this.snackBar.open('Foto agregada', 'Cerrar', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('Error al subir foto', 'Cerrar', { duration: 3000 });
        }
      });
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    input.value = '';
  }

  removePhoto(index: number): void {
    if (!this.quotation) return;
    this.quotationsService.removePhoto(this.quotation.id, index).subscribe({
      next: (updated) => {
        this.quotation = updated;
        this.snackBar.open('Foto eliminada', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Error al eliminar foto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  saveToAlbum(): void {
    if (!this.quotation) return;
    this.router.navigate(['/catalog/new'], {
      queryParams: {
        quotationId: this.quotation.id,
        clientName: this.quotation.clientName
      }
    });
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
