import { Component } from '@angular/core';
import { PDFPage } from '../models/pdf-page';
import { PDFPageService } from '../services/pdf-page.service';
import { DataSet } from 'vis-network/standalone/esm/vis-network';
import { Network } from 'vis-network/standalone/esm/vis-network';
import { Node } from 'vis-network/standalone/esm/vis-network';
import { Edge } from 'vis-network/standalone/esm/vis-network';
import { IdType } from 'vis-network/standalone/esm/vis-network';
import { Options } from 'vis-network/standalone/esm/vis-network';
import { Data } from 'vis-network/standalone/esm/vis-network';
import { NodeOptions } from 'vis-network/standalone/esm/vis-network';
import { EdgeOptions } from 'vis-network/standalone/esm/vis-network';


@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent {
  pages: PDFPage[] = [];
  private network: Network | undefined;
  private nodes: Node[] = [];
  private edges: Edge[] = [];
  pdfUrl: string = '';
  selectedDocumentName: string = '';
  contextualInfo: string = '';


  constructor(private pdfPageService: PDFPageService) {}

  ngOnInit(): void {
    this.pages = this.pdfPageService.getPages();
    const files = this.pdfPageService.getFiles();
    if (files.length > 0) {
      const file = files[0];
      if (file instanceof Blob) {
        const url = URL.createObjectURL(file);
        this.pdfUrl = url;
        this.selectedDocumentName = file.name;
      }
    }
    this.createNetwork();
  }

  private createNetwork(): void {
  const container = document.getElementById('network-container');
  const options = {
    nodes: {
      shape: 'dot',
      size: 20,
      font: {
        size: 14,
        color: '#333333',
      },
    },
    edges: {
      width: 2,
      color: '#999999',
    },
    physics: {
      enabled: true,
    },
  };
  this.network = new Network(container!, { nodes: this.nodes, edges: this.edges }, options);

  // Create nodes for each page and file
  this.pages.forEach(page => {
    const fileNode = {
      id: page.file.name,
      label: page.file.name,
      group: 'file',
    };
    console.log(page);
    const pageNode = {
      id: page.pageNumber + "-" + page.file.name,
      label: `Page ${page.pageNumber}`,
      group: 'page',
    };
    // check if file node already exists
    if (!this.nodes.find(node => node.id === fileNode.id)) {
      this.nodes.push(fileNode);
    }
    this.nodes.push(pageNode);
    this.edges.push({ from: page.file.name, to: page.pageNumber + "-" + page.file.name });

    // Add category nodes and edges
    for (const category in page.standardCategories) {
      // get first key of object
      const categoryLabel = Object.keys(page.standardCategories)[category as unknown as number];
      const listOfSubcategories = page.standardCategories[categoryLabel];
      let categoryText = Object.keys(listOfSubcategories)[0]
      let listOfValues = Object.values(listOfSubcategories)[0];
      let hasEntries = false;


      const categoryNode = {
        id: `${page.pageNumber}-${category}`,
        label: categoryText,
        group: 'category',
      };

      // Add subcategory nodes and edges
      if (Array.isArray(listOfValues)) {
        for (const subcategory of listOfValues) {
          hasEntries = true;
          const subcategoryNode = {
            id: `${page.pageNumber}-${subcategory}`,
            label: subcategory,
            group: 'subcategory',
          };
          this.nodes.push(subcategoryNode);
          this.edges.push({ from: `${page.pageNumber}-${category}`, to: `${page.pageNumber}-${subcategory}` });
          this.edges.push({ from: `${page.pageNumber}-${category}`, to: page.pageNumber + "-" + page.file.name });
        }
      }
      if (hasEntries) {
        this.nodes.push(categoryNode);
      }
    }

    // Add evaluation nodes and edges
    if (page.evaluations) {
      page.evaluations.forEach((evaluation, index) => {
        const evaluationNode = {
          id: `${page.pageNumber}-evaluation-${index}`,
          label: `${evaluation.question} - ${evaluation.answer}`,
          group: 'evaluation',
        };
        this.nodes.push(evaluationNode);
        this.edges.push({ from: page.pageNumber, to: `${page.pageNumber}-evaluation-${index}` });
      });
    }

    // Add extended category nodes and edges
    for (const category in page.extendedCategories) {
      let hasEntries = false;
      const categoryLabel = Object.keys(page.extendedCategories)[category as unknown as number];
      const listOfSubcategories = page.extendedCategories[categoryLabel];
      let categoryText = Object.keys(listOfSubcategories)[0]
      let listOfValues = Object.values(listOfSubcategories)[0];

      const categoryNode = {
        id: `${page.pageNumber}-extended-${category}`,
        label: categoryText,
        group: 'extended-category',
      };

      // Add subcategory nodes and edges

      // get first attribute of object listOfSubcategories
      // get value of object listOfSubcategories (typescript)
      

      if (Array.isArray(listOfValues)) {
        for (const subcategory of listOfValues) {
          hasEntries = true;
          const subcategoryNode = {
            id: `${page.pageNumber}-extended-${subcategory}`,
            label: subcategory,
            group: 'extended-subcategory',
          };
          this.nodes.push(subcategoryNode);
          this.edges.push({ from: `${page.pageNumber}-extended-${category}`, to: `${page.pageNumber}-extended-${subcategory}` });
          this.edges.push({ from: `${page.pageNumber}-extended-${category}`, to: page.pageNumber + "-" + page.file.name });
        }
      }

      if (hasEntries) {
        this.nodes.push(categoryNode);
        this.edges.push({ from: page.pageNumber, to: `${page.pageNumber}-extended-${category}` });
      }
    }
  });

  this.network.setData({ nodes: this.nodes, edges: this.edges });
}

}
