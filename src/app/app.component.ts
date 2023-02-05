import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'whitlock';
  currentYear!: number;

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
  }
}
