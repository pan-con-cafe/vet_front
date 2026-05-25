import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-logout-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './logout-dialog.component.html',
  styleUrl: './logout-dialog.component.scss'
})
export class LogoutDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<LogoutDialogComponent>,
    private authService: AuthService
  ) {}

  cancel() { this.dialogRef.close(); }
  logout() { this.authService.logout(); this.dialogRef.close(); }

}
