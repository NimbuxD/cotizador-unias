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
import { MatExpansionModule } from '@angular/material/expansion';
import { ServicesService } from '../services.service';
import { NailService } from '../nail-service.model';

@Component({
  selector: 'app-services-list',
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
    MatExpansionModule
  ],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  services: NailService[] = [];
  filteredServices: NailService[] = [];
  displayedColumns = ['name', 'basePrice', 'laborCost', 'materialCost', 'totalCost', 'actions'];
  loading = true;
  searchTerm = '';

  constructor(
    private servicesService: ServicesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.servicesService.getAll().subscribe({
      next: (services) => {
        this.services = services;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar los servicios', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredServices = [...this.services];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredServices = this.services.filter(s =>
        s.name.toLowerCase().includes(term) ||
        (s.description && s.description.toLowerCase().includes(term))
      );
    }
  }

  getTotalCost(service: NailService): number {
    return (service.laborCost || 0) + (service.materialCost || 0);
  }

  deleteService(service: NailService): void {
    if (confirm(`¿Eliminar el servicio "${service.name}"?`)) {
      this.servicesService.delete(service.id).subscribe({
        next: () => {
          this.snackBar.open('Servicio eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadServices();
        },
        error: () => {
          this.snackBar.open('Error al eliminar el servicio', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
