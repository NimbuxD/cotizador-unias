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
import { QuotationsService } from '../quotations.service';
import { ServicesService } from '../../services/services.service';
import { NailService } from '../../services/nail-service.model';

@Component({
  selector: 'app-quotation-form',
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
    MatDividerModule
  ],
  templateUrl: './quotation-form.component.html',
  styleUrl: './quotation-form.component.scss'
})
export class QuotationFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  saving = false;
  editId: number | null = null;
  isEdit = false;
  nailServices: NailService[] = [];

  get extras(): FormArray {
    return this.form.get('extras') as FormArray;
  }

  get extrasTotalCost(): number {
    return this.extras.controls.reduce((sum, ctrl) => {
      return sum + (Number(ctrl.get('cost')?.value) || 0);
    }, 0);
  }

  statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'rejected', label: 'Rechazado' },
    { value: 'completed', label: 'Completado' }
  ];

  constructor(
    private fb: FormBuilder,
    private quotationsService: QuotationsService,
    private servicesService: ServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      clientName: ['', [Validators.required, Validators.minLength(2)]],
      clientPhone: [''],
      clientEmail: ['', Validators.email],
      status: ['pending', Validators.required],
      notes: [''],
      appointmentTime: [''],
      services: this.fb.array([]),
      extras: this.fb.array([])
    });
  }

  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  get totalMaterialCost(): number {
    return this.services.controls.reduce((sum, ctrl) => {
      const service = this.nailServices.find(s => s.id === ctrl.get('serviceId')?.value);
      const qty = ctrl.get('quantity')?.value || 1;
      return sum + ((service?.materialCost || 0) * qty);
    }, 0);
  }

  get totalLaborCost(): number {
    return this.services.controls.reduce((sum, ctrl) => {
      const service = this.nailServices.find(s => s.id === ctrl.get('serviceId')?.value);
      const qty = ctrl.get('quantity')?.value || 1;
      return sum + ((service?.laborCost || 0) * qty);
    }, 0);
  }

  get totalCost(): number {
    return this.services.controls.reduce((sum, ctrl) => {
      const qty = ctrl.get('quantity')?.value || 1;
      const price = ctrl.get('unitPrice')?.value || 0;
      return sum + (price * qty);
    }, 0);
  }

  ngOnInit(): void {
    this.servicesService.getAll().subscribe(services => {
      this.nailServices = services;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.isEdit = true;
      this.loadQuotation();
    }
  }

  addExtra(name: string = '', cost: number = 0): void {
    this.extras.push(this.fb.group({
      name: [name],
      cost: [cost, [Validators.min(0)]]
    }));
  }

  removeExtra(index: number): void {
    this.extras.removeAt(index);
  }

  loadQuotation(): void {
    this.loading = true;
    this.quotationsService.getById(this.editId!).subscribe({
      next: (q) => {
        this.form.patchValue({
          clientName: q.clientName,
          clientPhone: q.clientPhone,
          clientEmail: q.clientEmail,
          status: q.status,
          notes: q.notes,
          appointmentTime: q.appointmentTime || ''
        });
        if (q.services) {
          q.services.forEach(s => this.addService(s.serviceId, s.quantity, s.unitPrice));
        }
        if (q.extras) {
          q.extras.forEach(e => this.addExtra(e.name, e.cost));
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar la cotización', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  addService(serviceId?: number, quantity?: number, unitPrice?: number): void {
    const service = serviceId ? this.nailServices.find(s => s.id === serviceId) : null;
    this.services.push(this.fb.group({
      serviceId: [serviceId || null, Validators.required],
      quantity: [quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [unitPrice ?? (service?.basePrice || 0), [Validators.required, Validators.min(0)]]
    }));
  }

  removeService(index: number): void {
    this.services.removeAt(index);
  }

  onServiceChange(index: number): void {
    const ctrl = this.services.at(index);
    const serviceId = ctrl.get('serviceId')?.value;
    const service = this.nailServices.find(s => s.id === serviceId);
    if (service) {
      ctrl.patchValue({ unitPrice: service.basePrice });
    }
  }

  getServiceSubtotal(index: number): number {
    const ctrl = this.services.at(index);
    const qty = ctrl.get('quantity')?.value || 1;
    const price = ctrl.get('unitPrice')?.value || 0;
    return qty * price;
  }

  getServiceName(serviceId: number): string {
    return this.nailServices.find(s => s.id === serviceId)?.name || '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const data = this.form.value;

    const request = this.isEdit
      ? this.quotationsService.update(this.editId!, data)
      : this.quotationsService.create(data);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Cotización actualizada' : 'Cotización creada exitosamente',
          'Cerrar',
          { duration: 3000 }
        );
        this.router.navigate(['/quotations']);
      },
      error: () => {
        this.snackBar.open('Error al guardar la cotización', 'Cerrar', { duration: 3000 });
        this.saving = false;
      }
    });
  }
}
