import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth.service';
import { ConsentDialogComponent } from '../consent-dialog/consent-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  async signInWithGoogle(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      const user = await this.authService.signInWithGoogle();

      if (!this.authService.hasConsented(user.uid)) {
        const dialogRef = this.dialog.open(ConsentDialogComponent, {
          width: '500px',
          disableClose: true,
        });
        const accepted = await dialogRef.afterClosed().toPromise() as boolean;
        if (!accepted) {
          await this.authService.signOut();
          this.loading = false;
          return;
        }
        this.authService.saveConsent(user.uid);
      }

      await this.router.navigate(['/dashboard']);
    } catch {
      this.error = 'No se pudo iniciar sesión. Por favor intenta de nuevo.';
    } finally {
      this.loading = false;
    }
  }
}
