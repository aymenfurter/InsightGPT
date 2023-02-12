import { Injectable } from '@angular/core';
import { PDFPage } from './../models/pdf-page';
import { LocalStorageService } from 'ngx-webstorage';
import { OpenaiService } from '../openai.service';

@Injectable({
providedIn: 'root'
})
export class PDFPageService {
    private pagesKey = 'pdf_pages';
    public progress = 0;

    constructor(private localStorage: LocalStorageService, private openaiService: OpenaiService) { }



    getPages(): PDFPage[] {
        return this.localStorage.retrieve(this.pagesKey) || [];
    }

    addPage(page: PDFPage): void {
        const pages = this.getPages();
        pages.push(page);
        this.localStorage.store(this.pagesKey, pages);
    }

    updatePage(page: PDFPage): void {
        const pages = this.getPages();
        const index = pages.findIndex(p => p.pageNumber === page.pageNumber);
        if (index !== -1) {
            pages[index] = page;
            this.localStorage.store(this.pagesKey, pages);
        }
    }

    deletePage(pageNumber: number): void {
        const pages = this.getPages().filter(p => p.pageNumber !== pageNumber);
        this.localStorage.store(this.pagesKey, pages);
    }
    
    deleteAllData(): void {
        this.localStorage.clear(this.pagesKey);
    }

    getNumberOfPages(): number {
        const pages = this.getPages();
        return pages.length;
    }

    getFiles(): File[] {
        const pages = this.getPages();
        const files: File[] = [];
        for (const page of pages) {
            if (!files.includes(page.file)) {
            files.push(page.file);
            }
        }
        return files;
    }

    getAnalyzedPages(): PDFPage[] {
        return this.getPages().filter(page => page.isAnalyzed);
    }

    async analyzePages() {
        const pages = this.getPages();
        let currentPageIndex = 0;
        const totalPages = pages.length;

        const updateProgress = () => {
            this.progress = (currentPageIndex / totalPages) * 100;
        };

        for (const page of pages) {
            if (!page.isAnalyzed) {
                var openaiResult = this.openaiService.getDataFromOpenAI(page.text);
                await this.openaiService.getDataFromOpenAI(page.text).then((result) => {
                    openaiResult = result
                    page.date = result.date;
                    page.evaluations = result.evaluations;
                    page.standardCategories = result.standardCategories;
                    page.extendedCategories = result.extendedCategories;
                    page.isAnalyzed = true;
                    this.updatePage(page);
                });
                console.log(openaiResult);
                setTimeout(() => {}, 500);
                currentPageIndex++;
                updateProgress();
            }
        }

        this.progress = 100;
    }


}