import { Component } from '@angular/core';
import { PDFPage } from '../models/pdf-page';
import { PDFPageService } from '../services/pdf-page.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent {
  pages: PDFPage[] = [];

  constructor(private pdfPageService: PDFPageService) {}

  ngOnInit(): void {
    this.pages = this.pdfPageService.getPages();
    console.log(this.pages);
  }
}
