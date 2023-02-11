import { Injectable } from '@angular/core';
import { PDFPage } from './../models/pdf-page';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
providedIn: 'root'
})
export class PDFPageService {
    private pagesKey = 'pdf_pages';

    constructor(private localStorage: LocalStorageService) { }

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
}