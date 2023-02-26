import { Injectable } from '@angular/core';
import { PDFPage } from './../models/pdf-page';
import { LocalStorageService } from 'ngx-webstorage';
import { OpenaiService } from '../openai.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
providedIn: 'root'
})

export class PDFPageService {
  private pages: PDFPage[] = [];
  private pagesKey = 'pdf_pages';
  public progress = 0;

  constructor(
    private localStorage: LocalStorageService,
    private http: HttpClient,
    private openaiService: OpenaiService
  ) {
    this.loadFromLocalStorage();
  }


  getPages(): PDFPage[] {
    return this.pages;
  }

  addPage(page: PDFPage): void {
    this.pages.push(page);
    this.saveToLocalStorage();
  }

  updatePage(page: PDFPage): void {
    const index = this.pages.findIndex((p) => p.pageNumber === page.pageNumber);
    if (index !== -1) {
      this.pages[index] = page;
    }
    this.saveToLocalStorage();
  }

  deletePage(pageNumber: number): void {
    this.pages = this.pages.filter((p) => p.pageNumber !== pageNumber);
    this.saveToLocalStorage();
  }

  deleteAllData(): void {
    this.pages = [];
    this.saveToLocalStorage();
  }

  getNumberOfPages(): number {
    return this.pages.length;
  }

  getFiles(): File[] {
    const files: File[] = [];
    for (const page of this.pages) {
      if (!files.includes(page.file)) {
        files.push(page.file);
      }
    }
    return files;
  }

  getAnalyzedPages(): PDFPage[] {
    return this.pages.filter((page) => page.isAnalyzed);
  }

  async analyzePages() {
    const pages = this.pages;
    let currentPageIndex = 0;
    const totalPages = pages.length;

    const updateProgress = () => {
      this.progress = (currentPageIndex / totalPages) * 100;
    };

    for (const page of pages) {
      if (!page.isAnalyzed) {
        const openaiResult = await this.openaiService.getDataFromOpenAI(page.text);
        page.date = openaiResult.date;
        page.evaluations = openaiResult.evaluations;
        page.standardCategories = openaiResult.standardCategories;
        page.extendedCategories = openaiResult.extendedCategories;
        page.isAnalyzed = true;
        this.updatePage(page);
        console.log(openaiResult);
        setTimeout(() => {}, 500);
        currentPageIndex++;
        updateProgress();
      }
    }

    this.progress = 100;
  }

  saveToLocalStorage() {
    this.pagesKey = 'pdf_pages';
    this.localStorage.store(this.pagesKey, this.pages);
  }

  loadFromLocalStorage() {
    this.pagesKey = 'pdf_pages';
    const pages = this.localStorage.retrieve(this.pagesKey) || [];
    this.pages = pages;
  }

  loadSampleData() {
    this.pagesKey = 'pdf_pages';
    this.http.get('assets/sample-data.json').subscribe((data: any) => {
      this.pages = data;
    });
  }
  loadSampleDataUFO() {
    this.pagesKey = 'pdf_pages';
    this.http.get('assets/sample-data-ufo.json').subscribe((data: any) => {
      this.pages = data;
    });
  }
}
