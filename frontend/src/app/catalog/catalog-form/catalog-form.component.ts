import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CatalogService } from '../catalog.service';
import { QuotationsService } from '../../quotations/quotations.service';

@Component({
  selector: 'app-catalog-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './catalog-form.component.html',
  styleUrl: './catalog-form.component.scss'
})
export class CatalogFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  saving = false;
  editId: number | null = null;
  isEdit = false;
  tags: string[] = [];
  tagInput = '';
  photos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private quotationsService: QuotationsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      serviceName: [''],
      tagInput: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.isEdit = true;
      this.loadItem();
    } else {
      // Pre-fill from query params when coming from quotation detail
      const qp = this.route.snapshot.queryParams;
      if (qp['quotationId']) {
        this.loadFromQuotation(Number(qp['quotationId']), qp['clientName'] || '');
      }
    }
  }

  loadItem(): void {
    this.loading = true;
    this.catalogService.getById(this.editId!).subscribe({
      next: (item) => {
        this.form.patchValue({
          title: item.title,
          description: item.description || '',
          serviceName: item.serviceName || ''
        });
        this.tags = item.tags ? [...item.tags] : [];
        this.photos = item.photos ? [...item.photos] : [];
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar el trabajo', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadFromQuotation(quotationId: number, clientName: string): void {
    this.loading = true;
    this.quotationsService.getById(quotationId).subscribe({
      next: (q) => {
        this.form.patchValue({
          title: `Trabajo de ${q.clientName}`,
          serviceName: q.services?.[0]?.serviceName || ''
        });
        this.photos = q.photos ? [...q.photos] : [];
        this.loading = false;
      },
      error: () => {
        this.form.patchValue({ title: `Trabajo de ${clientName}` });
        this.loading = false;
      }
    });
  }

  addTag(): void {
    const val = this.form.get('tagInput')?.value?.trim();
    if (val && !this.tags.includes(val)) {
      this.tags.push(val);
    }
    this.form.patchValue({ tagInput: '' });
  }

  addTagsFromInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value;
    // Support comma-separated tags
    if (raw.endsWith(',')) {
      const tag = raw.slice(0, -1).trim();
      if (tag && !this.tags.includes(tag)) {
        this.tags.push(tag);
      }
      this.form.patchValue({ tagInput: '' });
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        this.photos.push(base64);
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removePhoto(index: number): void {
    this.photos.splice(index, 1);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const data = {
      title: this.form.get('title')?.value,
      description: this.form.get('description')?.value,
      serviceName: this.form.get('serviceName')?.value,
      tags: this.tags,
      photos: this.photos
    };

    const request = this.isEdit
      ? this.catalogService.update(this.editId!, data)
      : this.catalogService.create(data);

    request.subscribe({
      next: (item) => {
        this.snackBar.open(
          this.isEdit ? 'Trabajo actualizado' : 'Trabajo guardado en catálogo',
          'Cerrar',
          { duration: 3000 }
        );
        this.router.navigate(['/catalog', item.id]);
      },
      error: () => {
        this.snackBar.open('Error al guardar', 'Cerrar', { duration: 3000 });
        this.saving = false;
      }
    });
  }
}
