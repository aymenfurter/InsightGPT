import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent {
  constructor(private matDialog: MatDialog, private dialogRef: MatDialogRef<InfoDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
