import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CatalogService } from '../catalog.service';
import { CatalogItem } from '../catalog-item.model';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './catalog-list.component.html',
  styleUrl: './catalog-list.component.scss'
})
export class CatalogListComponent implements OnInit {
  items: CatalogItem[] = [];
  loading = true;

  constructor(
    private catalogService: CatalogService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.catalogService.getAll().subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar el catálogo', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getMainPhoto(item: CatalogItem): string | null {
    return item.photos && item.photos.length > 0 ? item.photos[0] : null;
  }

  goToDetail(id: number): void {
    this.router.navigate(['/catalog', id]);
  }
}
