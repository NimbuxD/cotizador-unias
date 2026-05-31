import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./auth/privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent,
      ),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./products/products-list/products-list.component').then(
        (m) => m.ProductsListComponent,
      ),
  },
  {
    path: 'products/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./products/product-form/product-form.component').then(
        (m) => m.ProductFormComponent,
      ),
  },
  {
    path: 'products/edit/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./products/product-form/product-form.component').then(
        (m) => m.ProductFormComponent,
      ),
  },
  {
    path: 'services',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./services/services-list/services-list.component').then(
        (m) => m.ServicesListComponent,
      ),
  },
  {
    path: 'services/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./services/service-form/service-form.component').then(
        (m) => m.ServiceFormComponent,
      ),
  },
  {
    path: 'services/edit/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./services/service-form/service-form.component').then(
        (m) => m.ServiceFormComponent,
      ),
  },
  {
    path: 'quotations',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./quotations/quotations-list/quotations-list.component').then(
        (m) => m.QuotationsListComponent,
      ),
  },
  {
    path: 'quotations/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./quotations/quotation-form/quotation-form.component').then(
        (m) => m.QuotationFormComponent,
      ),
  },
  {
    path: 'quotations/edit/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./quotations/quotation-form/quotation-form.component').then(
        (m) => m.QuotationFormComponent,
      ),
  },
  {
    path: 'quotations/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./quotations/quotation-detail/quotation-detail.component').then(
        (m) => m.QuotationDetailComponent,
      ),
  },
  {
    path: 'reports',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./reports/reports.component').then((m) => m.ReportsComponent),
  },
  {
    path: 'catalog',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./catalog/catalog-list/catalog-list.component').then(
        (m) => m.CatalogListComponent,
      ),
  },
  {
    path: 'catalog/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./catalog/catalog-form/catalog-form.component').then(
        (m) => m.CatalogFormComponent,
      ),
  },
  {
    path: 'catalog/:id/edit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./catalog/catalog-form/catalog-form.component').then(
        (m) => m.CatalogFormComponent,
      ),
  },
  {
    path: 'catalog/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./catalog/catalog-detail/catalog-detail.component').then(
        (m) => m.CatalogDetailComponent,
      ),
  },
  { path: '**', redirectTo: '/dashboard' },
];
