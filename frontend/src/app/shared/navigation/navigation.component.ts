import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  @Input() narrow = false;

  currentUser: User | null = null;

  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/products', label: 'Productos', icon: 'inventory_2' },
    { path: '/services', label: 'Servicios', icon: 'spa' },
    { path: '/quotations', label: 'Cotizaciones', icon: 'request_quote' },
    { path: '/catalog', label: 'Catálogo', icon: 'photo_library' },
    { path: '/reports', label: 'Reportes', icon: 'bar_chart' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  async logout(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }

  getDisplayName(): string {
    if (!this.currentUser) return '';
    return this.currentUser.displayName ?? this.currentUser.email ?? '';
  }
}
