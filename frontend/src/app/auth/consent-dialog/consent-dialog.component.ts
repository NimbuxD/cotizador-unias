import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-consent-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './consent-dialog.component.html',
})
export class ConsentDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConsentDialogComponent>) {}

  accept(): void {
    this.dialogRef.close(true);
  }

  decline(): void {
    this.dialogRef.close(false);
  }
}
