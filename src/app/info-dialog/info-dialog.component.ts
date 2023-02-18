import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent {
  constructor(private router: Router, public configService: ConfigService, private matDialog: MatDialog, private dialogRef: MatDialogRef<InfoDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }

  onConfigure() {
    // navigate to /settings
    this.dialogRef.close();
    this.router.navigate(['/settings']);
  }
}
