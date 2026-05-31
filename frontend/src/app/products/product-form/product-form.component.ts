import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-form',
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
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  saving = false;
  editId: number | null = null;
  isEdit = false;

  categories = ['Bases', 'Esmaltes', 'Geles', 'Acrilicos', 'Herramientas', 'Decoracion', 'Limpieza', 'Otros'];
  units = ['ml', 'g', 'unidad', 'par', 'caja', 'tubo', 'frasco'];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      category: [''],
      unit: ['', Validators.required],
      costPerUnit: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      minStock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.isEdit = true;
      this.loadProduct();
    }
  }

  loadProduct(): void {
    this.loading = true;
    this.productsService.getById(this.editId!).subscribe({
      next: (product) => {
        this.form.patchValue(product);
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar el producto', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const data = this.form.value;

    const request = this.isEdit
      ? this.productsService.update(this.editId!, data)
      : this.productsService.create(data);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Producto actualizado' : 'Producto creado exitosamente',
          'Cerrar',
          { duration: 3000 }
        );
        this.router.navigate(['/products']);
      },
      error: () => {
        this.snackBar.open('Error al guardar el producto', 'Cerrar', { duration: 3000 });
        this.saving = false;
      }
    });
  }
}
