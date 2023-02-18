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
import { ConfigService } from '../services/config.service';
import { config } from 'rxjs';

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


  constructor(private pdfPageService: PDFPageService, private configService: ConfigService) {}


  ngOnInit(): void {
    this.pages = this.pdfPageService.getPages();
    const files = this.pdfPageService.getFiles();
    if (files.length > 0) {
      const file = files[0];
      if (file instanceof Blob) {
        const url = URL.createObjectURL(file);
        this.pdfUrl = url;
        this.selectedDocumentName = "not selected";
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

  var net = this.network;
  // Create nodes for each page and file
  this.pages.forEach(page => {
    const fileNode = {
      id: page.fileName,
      label: page.fileName,
      group: 'file',
    };
    const pageNode = {
      id: page.pageNumber + "-" + page.fileName,
      label: `Page ${page.pageNumber}`,
      group: 'page',
    };

    net.on('click', (params) => {
    if (params.nodes[0] === pageNode.id) {
        this.contextualInfo = page.text;
        this.selectedDocumentName = page.fileName + " (Page " + page.pageNumber + ")";
      }
    });
    // check if file node already exists
    if (!this.nodes.find(node => node.id === fileNode.id)) {
      this.nodes.push(fileNode);
    }
    this.nodes.push(pageNode);
    this.edges.push({ from: page.fileName, to: page.pageNumber + "-" + page.fileName });

    // Add category nodes and edges
    for (const category in page.standardCategories) {
      if (this.configService.getStandardEntitiesEnabled() === false) {
        break;
      }
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
          // check if edge already exists
          if (!this.edges.find(edge => edge.from === page.pageNumber + "-" + page.fileName && edge.to === `${page.pageNumber}-${subcategory}`)) { 
            this.edges.push({ from: `${page.pageNumber}-${category}`, to: page.pageNumber + "-" + page.fileName });
          }
        }
      }
      if (hasEntries) {
        this.nodes.push(categoryNode);
        net.on('click', (params) => {
          var selectedNodeId = params.nodes[0];
          if (selectedNodeId === undefined) {
            return;
          }
          const selectedNodeIdParts = selectedNodeId.split('-');
          if (selectedNodeIdParts.length === 3) {
            const selectedCategory = selectedNodeIdParts[2];
            this.showPage(selectedCategory);
          }
        });
      }
    }

    // Add evaluation nodes and edges
    /*
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
    }*/

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

          // check if it already exists
          if (!this.edges.find(edge => edge.from === `${page.pageNumber}-extended-${category}` && edge.to === page.pageNumber + "-" + page.fileName)) {
            this.edges.push({ from: `${page.pageNumber}-extended-${category}`, to: page.pageNumber + "-" + page.fileName });
          }
        }
      }

      if (hasEntries) {
        this.nodes.push(categoryNode);
        this.edges.push({ from: page.pageNumber, to: `${page.pageNumber}-extended-${category}` });
        net.on('click', (params) => {
          const selectedNodeId = params.nodes[0];
          if (selectedNodeId === undefined) {
            return;
          }
          const selectedNodeIdParts = selectedNodeId.split('-');
          if (selectedNodeIdParts.length === 3) {
            const selectedCategory = selectedNodeIdParts[2];
            this.showPage(selectedCategory);
          }
        });
      }
    }
  });


  // remove duplicates
  this.nodes = this.nodes.filter((node, index, self) =>
    index === self.findIndex((t) => (
      t.id === node.id
    ))
  );

  // remove duplicate edge
  this.edges = this.edges.filter((edge, index, self) =>
    index === self.findIndex((t) => (
      t.from === edge.from && t.to === edge.to
    ))
  );


  this.network.setData({ nodes: this.nodes, edges: this.edges });
}

showPage(searchTerm: string): void {
  // return if text search term is smaller than 3 chars
  if (searchTerm.length < 3) {
    return;
  }
  // Remove existing bold spans
  this.contextualInfo = this.contextualInfo.replace(/<span class="bold">/g, '');
  this.contextualInfo = this.contextualInfo.replace(/<\/span>/g, '');

  // Create a new RegExp with the search term
  const searchTermRegex = new RegExp(searchTerm, 'gi');

  // Highlight search term by wrapping it with a span element that has the class "bold"
  this.contextualInfo = this.contextualInfo.replace(searchTermRegex, '<span class="bold">$&</span>');
}
}
