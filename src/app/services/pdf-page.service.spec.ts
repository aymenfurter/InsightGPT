import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from 'ngx-webstorage';
import { PDFPageService } from './pdf-page.service';
import { PDFPage } from '../models/pdf-page';

describe('PDFPageService', () => {
  let service: PDFPageService;
  let storage: jasmine.SpyObj<LocalStorageService>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PDFPageService,
        { provide: LocalStorageService, useValue: jasmine.createSpyObj('LocalStorageService', ['retrieve', 'store']) }
      ]
    });
    service = TestBed.get(PDFPageService);
    storage = TestBed.get(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPages', () => {
    it('should return an empty array if there are no pages stored', () => {
      storage.retrieve.and.returnValue(null);
      expect(service.getPages()).toEqual([]);
    });

    it('should return the stored pages', () => {
      const pages = [
        new PDFPage(new File([], ''), 'text1', 1),
        new PDFPage(new File([], ''), 'text2', 2)
      ];
      storage.retrieve.and.returnValue(pages);
      expect(service.getPages()).toEqual(pages);
    });
  });

  describe('addPage', () => {
    it('should add a page to the stored pages', () => {
      const page = new PDFPage(new File([], ''), 'text', 1);
      service.addPage(page);
      expect(storage.store).toHaveBeenCalledWith('pdf_pages', [page]);
    });
  });

  describe('updatePage', () => {
    it('should update a page in the stored pages', () => {
      const pages = [
        new PDFPage(new File([], ''), 'text1', 1),
        new PDFPage(new File([], ''), 'text2', 2)
      ];
      storage.retrieve.and.returnValue(pages);
      const updatedPage = new PDFPage(new File([], ''), 'updated text', 2);
      service.updatePage(updatedPage);
      expect(storage.store).toHaveBeenCalledWith('pdf_pages', [pages[0], updatedPage]);
    });

    it('should not update a page if it does not exist in the stored pages', () => {
      storage.retrieve.and.returnValue([]);
      const page = new PDFPage(new File([], ''), 'text', 1);
      service.updatePage(page);
      expect(storage.store).not.toHaveBeenCalled();
    });
  });

  describe('deletePage', () => {
    it('should delete a page from the stored pages', () => {
      const pages = [
        new PDFPage(new File([], ''), 'text1', 1),
        new PDFPage(new File([], ''), 'text2', 2)
      ];
      storage.retrieve.and.returnValue(pages);
      service.deletePage(2);
      expect(storage.store).toHaveBeenCalledWith('pdf_pages', [pages[0]]);
    });
  });
});
