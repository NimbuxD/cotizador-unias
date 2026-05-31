import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CatalogService } from '../catalog.service';
import { CatalogItem } from '../catalog-item.model';

@Component({
  selector: 'app-catalog-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './catalog-detail.component.html',
  styleUrl: './catalog-detail.component.scss'
})
export class CatalogDetailComponent implements OnInit {
  item: CatalogItem | null = null;
  loading = true;
  activePhotoIndex = 0;

  constructor(
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalogService.getById(id).subscribe({
      next: (item) => {
        this.item = item;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar el trabajo', 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/catalog']);
      }
    });
  }

  get activePhoto(): string | null {
    if (!this.item?.photos || this.item.photos.length === 0) return null;
    return this.item.photos[this.activePhotoIndex] || null;
  }

  prevPhoto(): void {
    if (!this.item?.photos) return;
    this.activePhotoIndex = (this.activePhotoIndex - 1 + this.item.photos.length) % this.item.photos.length;
  }

  nextPhoto(): void {
    if (!this.item?.photos) return;
    this.activePhotoIndex = (this.activePhotoIndex + 1) % this.item.photos.length;
  }

  setPhoto(index: number): void {
    this.activePhotoIndex = index;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || !this.item) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        this.catalogService.addPhoto(this.item!.id, base64).subscribe({
          next: (updated) => {
            this.item = updated;
            this.activePhotoIndex = (this.item?.photos?.length ?? 1) - 1;
          },
          error: () => {
            this.snackBar.open('Error al subir foto', 'Cerrar', { duration: 3000 });
          }
        });
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removePhoto(index: number): void {
    if (!this.item) return;
    this.catalogService.removePhoto(this.item.id, index).subscribe({
      next: (updated) => {
        this.item = updated;
        const maxIndex = (this.item?.photos?.length ?? 1) - 1;
        if (this.activePhotoIndex > maxIndex) {
          this.activePhotoIndex = Math.max(0, maxIndex);
        }
        this.snackBar.open('Foto eliminada', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Error al eliminar foto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteItem(): void {
    if (!this.item) return;
    if (confirm(`¿Eliminar "${this.item.title}" del catálogo?`)) {
      this.catalogService.delete(this.item.id).subscribe({
        next: () => {
          this.snackBar.open('Trabajo eliminado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/catalog']);
        },
        error: () => {
          this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
