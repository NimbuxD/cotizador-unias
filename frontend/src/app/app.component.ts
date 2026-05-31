import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

const AUTH_ROUTES = ['/login', '/privacy-policy'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    NavigationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Cotizador de Uñas';
  isMobile = false;
  isTablet = false;
  sidenavOpened = true;
  sidenavMode: 'side' | 'over' = 'side';
  showAppLayout = false;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  private subs: Subscription[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.checkRoute(this.router.url);

    this.subs.push(
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe((e) => {
          this.checkRoute((e as NavigationEnd).url);
        }),
    );

    this.subs.push(
      this.breakpointObserver
        .observe(['(max-width: 767px)', '(min-width: 768px) and (max-width: 1024px)'])
        .subscribe((result) => {
          const bp = result.breakpoints;
          this.isMobile = bp['(max-width: 767px)'];
          this.isTablet = bp['(min-width: 768px) and (max-width: 1024px)'];
          if (this.isMobile) {
            this.sidenavMode = 'over';
            this.sidenavOpened = false;
          } else {
            this.sidenavMode = 'side';
            this.sidenavOpened = true;
          }
        }),
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private checkRoute(url: string): void {
    const path = url.split('?')[0];
    this.showAppLayout = !AUTH_ROUTES.some((r) => path.startsWith(r));
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}
