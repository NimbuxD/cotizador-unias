import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./products/products-list/products-list.component').then(m => m.ProductsListComponent)
  },
  {
    path: 'products/new',
    loadComponent: () => import('./products/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'products/edit/:id',
    loadComponent: () => import('./products/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./services/services-list/services-list.component').then(m => m.ServicesListComponent)
  },
  {
    path: 'services/new',
    loadComponent: () => import('./services/service-form/service-form.component').then(m => m.ServiceFormComponent)
  },
  {
    path: 'services/edit/:id',
    loadComponent: () => import('./services/service-form/service-form.component').then(m => m.ServiceFormComponent)
  },
  {
    path: 'quotations',
    loadComponent: () => import('./quotations/quotations-list/quotations-list.component').then(m => m.QuotationsListComponent)
  },
  {
    path: 'quotations/new',
    loadComponent: () => import('./quotations/quotation-form/quotation-form.component').then(m => m.QuotationFormComponent)
  },
  {
    path: 'quotations/edit/:id',
    loadComponent: () => import('./quotations/quotation-form/quotation-form.component').then(m => m.QuotationFormComponent)
  },
  {
    path: 'quotations/:id',
    loadComponent: () => import('./quotations/quotation-detail/quotation-detail.component').then(m => m.QuotationDetailComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
