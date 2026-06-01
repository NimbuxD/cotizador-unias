import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { forkJoin, of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ServicesService } from '../services.service';
import { ProductsService } from '../../products/products.service';
import { Product } from '../../products/product.model';

@Component({
  selector: 'app-service-form',
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
    MatSnackBarModule,
    MatDividerModule,
    MatTableModule
  ],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  saving = false;
  editId: number | null = null;
  isEdit = false;
  products: Product[] = [];
  removedMaterialIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      laborCost: [0, [Validators.required, Validators.min(0)]],
      materials: this.fb.array([])
    });
  }

  get materials(): FormArray {
    return this.form.get('materials') as FormArray;
  }

  get totalMaterialCost(): number {
    return this.materials.controls.reduce((sum, ctrl) => {
      const product = this.products.find(p => p.id === ctrl.get('productId')?.value);
      const quantity = ctrl.get('quantityUsed')?.value || 0;
      return sum + (product ? product.unitCost * quantity : 0);
    }, 0);
  }

  get totalCost(): number {
    return (this.form.get('laborCost')?.value || 0) + this.totalMaterialCost;
  }

  ngOnInit(): void {
    this.productsService.getAll().subscribe(products => {
      this.products = products;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.isEdit = true;
      this.loadService();
    }
  }

  loadService(): void {
    this.loading = true;
    this.servicesService.getById(this.editId!).subscribe({
      next: (service) => {
        this.form.patchValue({
          name: service.name,
          description: service.description,
          basePrice: service.basePrice,
          laborCost: service.laborCost
        });
        if (service.materials) {
          service.materials.forEach(m => this.addMaterial(m.productId, m.quantityUsed, m.id));
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar el servicio', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  addMaterial(productId?: number, quantityUsed?: number, materialId?: number): void {
    this.materials.push(this.fb.group({
      id: [materialId || null],
      productId: [productId || null, Validators.required],
      quantityUsed: [quantityUsed || 1, [Validators.required, Validators.min(0.01)]]
    }));
  }

  removeMaterial(index: number): void {
    const id = this.materials.at(index).get('id')?.value;
    if (id) this.removedMaterialIds.push(id);
    this.materials.removeAt(index);
  }

  getProductName(productId: number): string {
    return this.products.find(p => p.id === productId)?.name || '';
  }

  getMaterialCost(index: number): number {
    const ctrl = this.materials.at(index);
    const product = this.products.find(p => p.id === ctrl.get('productId')?.value);
    const quantity = ctrl.get('quantityUsed')?.value || 0;
    return product ? product.unitCost * quantity : 0;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formValue = this.form.value;
    const serviceData = {
      name: formValue.name,
      description: formValue.description,
      basePrice: formValue.basePrice,
      laborCost: formValue.laborCost,
    };

    const saveService$ = this.isEdit
      ? this.servicesService.update(this.editId!, serviceData)
      : this.servicesService.create(serviceData);

    saveService$.pipe(
      switchMap(savedService => {
        const serviceId = savedService.id;
        const ops: Observable<any>[] = [];

        this.removedMaterialIds.forEach(id => {
          ops.push(this.servicesService.deleteMaterial(serviceId, id));
        });

        (formValue.materials as any[]).forEach(m => {
          const dto = { productId: m.productId, quantityUsed: m.quantityUsed };
          if (m.id) {
            ops.push(this.servicesService.updateMaterial(serviceId, m.id, dto));
          } else {
            ops.push(this.servicesService.addMaterial(serviceId, dto));
          }
        });

        return ops.length ? forkJoin(ops) : of(null);
      })
    ).subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Servicio actualizado' : 'Servicio creado exitosamente',
          'Cerrar',
          { duration: 3000 }
        );
        this.router.navigate(['/services']);
      },
      error: () => {
        this.snackBar.open('Error al guardar el servicio', 'Cerrar', { duration: 3000 });
        this.saving = false;
      }
    });
  }
}
