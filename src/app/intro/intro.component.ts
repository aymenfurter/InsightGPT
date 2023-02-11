import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpenaiService } from '../openai.service';
import * as pdfjs from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';


@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
})
export class IntroComponent {
  constructor(private router: Router, private openAi: OpenaiService) { }

  ngOnInit(): void {
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.3.122/pdf.worker.min.js';
  }
  onDrop(event: Event) {
    event.preventDefault();
    const files = (event.target as HTMLInputElement).files;
    console.log(files);
    // process the files here
  }

  onDragOver(event: Event) {
    event.preventDefault();
  }

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    console.log(files);

    if (files == null) {
      return;
    }

    // loop through files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(file);
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async () => {
          const typedArray = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
          const numPages = pdf.numPages;
          let text = '';

          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items
            .filter(item => item.hasOwnProperty('str'))
            .map(item => (item as TextItem).str)
            .join('');
          }

          console.log(text);
        };
        reader.readAsArrayBuffer(file);
      }
    }





    this.router.navigate(['/browse']);
    var response = this.openAi.getDataFromOpenAI("Hi? Anyone listening?");
    
    console.log(response);

    // process the files here
  }
}
