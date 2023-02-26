import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { PDFPageService } from '../services/pdf-page.service';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent {
  constructor(private pdfPageService: PDFPageService, private router: Router, public configService: ConfigService, private matDialog: MatDialog, private dialogRef: MatDialogRef<InfoDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }

  onSampleDataUFO() {
    this.dialogRef.close();
    this.pdfPageService.loadSampleDataUFO();
    this.configService.setStandardEntitiesEnabled(false);
    setTimeout(() => {
      this.router.navigate(['/browse']);
    }
    , 500);

  }
  onSampleData() {
    this.dialogRef.close();
    this.pdfPageService.loadSampleData();
    this.configService.setStandardEntitiesEnabled(false);
    setTimeout(() => {
      this.router.navigate(['/browse']);
    }
    , 500);
  }
  onConfigure() {
    // navigate to /settings
    this.dialogRef.close();
    this.router.navigate(['/settings']);
  }
}
