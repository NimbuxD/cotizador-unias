import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatDividerModule, MatTooltipModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  @Input() narrow = false;

  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/products', label: 'Productos', icon: 'inventory_2' },
    { path: '/services', label: 'Servicios', icon: 'spa' },
    { path: '/quotations', label: 'Cotizaciones', icon: 'request_quote' },
    { path: '/catalog', label: 'Catálogo', icon: 'photo_library' },
    { path: '/reports', label: 'Reportes', icon: 'bar_chart' },
  ];
}
