export class PDFPage {
  file: File;
  isAnalyzed: boolean;
  text: string;
  pageNumber: number;
  entityCategories: string[] = [];
  date: string = '';
  standardCategories: {[category: string]: string[]} = {};
  evaluations: {question: string, answer: string}[] = [];

  constructor(file: File, text: string, pageNumber: number) {
    this.file = file;
    this.text = text;
    this.pageNumber = pageNumber;
    this.isAnalyzed = false;
  }
}