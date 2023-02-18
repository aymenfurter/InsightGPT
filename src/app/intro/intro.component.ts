import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpenaiService } from '../openai.service';
import * as pdfjs from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { PDFPage } from './../models/pdf-page';
import { PDFPageService } from './../services/pdf-page.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from "@angular/material/form-field";
import { ConfigService } from '../services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'], 
})
export class IntroComponent {
  constructor(private dialog: MatDialog, private configService: ConfigService, private matProgress: MatProgressBarModule, private matBadge: MatBadgeModule, private matIcon: MatIconModule, private snackBar: MatSnackBar, private router: Router, private openAi: OpenaiService, public pdfPageService: PDFPageService) { }
  numPages: number = 0;

  ngOnInit(): void {
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.3.122/pdf.worker.min.js';
    this.numPages = this.pdfPageService.getPages().length;

    // check if config api key is not set
    if (this.configService.getOpenAIToken() == '') {
      this.dialog.open(InfoDialogComponent, {
      width: '600px',
      enterAnimationDuration: 200,
      exitAnimationDuration: 200
    });
    }
  }
  onDrop(event: Event) {
    event.preventDefault();
  }

  onDragOver(event: Event) {
    event.preventDefault();
  }

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;

    if (files == null) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(file);
      if (file.type !== 'application/pdf') {
        this.snackBar.open('Error: Only PDF files are allowed', '', {
          duration: 3000,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
        const numPages = pdf.numPages;

        var hasText = false;

        for (let i = 1; i <= numPages; i++) {
          let text = '';
          
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items
          .filter(item => item.hasOwnProperty('str'))
          .map(item => (item as TextItem).str)
          .join('');

          if (text.length > 0) {
            hasText = true;
          }
          
          const pdfPage = new PDFPage(file, text, i);
          this.pdfPageService.addPage(pdfPage); // Add the generated page to the service
        }

        // print warning if text is empty
        if (!hasText) {
          this.snackBar.open(`Warning: No text found in ${file.name}.`, 'Close');
        } else {
          this.snackBar.open(`${numPages} pages added from ${file.name}.`, 'Close');
        }

        this.numPages = this.pdfPageService.getPages().length;
  
      };
      reader.readAsArrayBuffer(file);
    }
  }
  onAnalyzeFiles() {
    this.pdfPageService.analyzePages();
  }

  onContinue() {
    this.router.navigate(['/browse']);
  }

  onReset() {
    this.pdfPageService.deleteAllData();
    this.snackBar.open('All data deleted.', 'Close');
    this.numPages = 0;
  }

}
