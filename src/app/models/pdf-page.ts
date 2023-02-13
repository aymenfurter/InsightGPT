export class PDFPage {
  file: File;
  isAnalyzed: boolean;
  text: string;
  fileName: string;
  pageNumber: number;
  entityCategories: string[] = [];
  date: string = '';
  standardCategories: {[category: string]: string[]} = {};
  extendedCategories: {[category: string]: string[]} = {};
  evaluations: {question: string, answer: string}[] = [];

  constructor(file: File, text: string, pageNumber: number) {
    this.file = file;
    this.text = text;
    this.fileName = file.name;
    this.pageNumber = pageNumber;
    this.isAnalyzed = false;
  }
}