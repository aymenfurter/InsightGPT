import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  title = 'whitlock';
  currentYear!: number;

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
  }
  openInfoDialog() {
    this.dialog.open(InfoDialogComponent, {
      width: '600px',
      enterAnimationDuration: 200,
      exitAnimationDuration: 200
    });
  }
}
