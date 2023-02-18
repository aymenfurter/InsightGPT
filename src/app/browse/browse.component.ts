import { Component, Inject } from '@angular/core';
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
import { ElementSchemaRegistry } from '@angular/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent {
  private createdElements = new Set<string>();
 
  // HashMap to store page number, file name and map it to text
  private pageTextMap = new Map<string, string>();
  pages: PDFPage[] = [];
  private network: Network | undefined;
  private nodes: Node[] = [];
  private edges: Edge[] = [];
  pdfUrl: string = '';
  selectedDocumentName: string = '';
  contextualInfo: string = '';


  constructor(public dialog: MatDialog, private pdfPageService: PDFPageService, private configService: ConfigService) {}


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
    const nodesAndEdges = this.getNodesAndEdges();
    const container = document.getElementById('network-container');
    const options = this.getNetworkOptions();
    this.initializeNetwork(container!, nodesAndEdges, options);
    this.addClickHandlers(this.network);
  }

  private createCategoryNodes(page: any, categoryType: string, nodes: any[], edges: any[]) {
    const categories = categoryType === 'standard' ? page.standardCategories : page.extendedCategories;

    for (const category in categories) {
      const categoryLabel = Object.keys(categories)[category as unknown as number];
      const listOfSubcategories = categories[categoryLabel];
      const categoryText = Object.keys(listOfSubcategories)[0];
      const listOfValues = Object.values(listOfSubcategories)[0];

      if (Array.isArray(listOfValues)) {
        for (const subcategory of listOfValues) {
          const subcategoryNode = {
            id: `${categoryType}-${subcategory}`,
            label: subcategory + '(' + categoryText + ')',
            group: `${categoryText}-subcategory`,
          };

          if (!this.elementExists(subcategoryNode.id)) {
            nodes.push(subcategoryNode);
          } else {
            // increase size of node 
            const node = nodes.find(n => n.id === subcategoryNode.id);
            if (node) {
              let currentSize = node.size;
              if (currentSize === undefined) {
                currentSize = 30;
              }
              node.size = currentSize +  5;
            }
          }

          if (!this.elementExists(`${categoryType}-${subcategory}-${page.fileName}-${page.pageNumber}}`)) {
            edges.push({ from: `${categoryType}-${subcategory}`, to: `${page.pageNumber}-${page.fileName}` });
          }
        }
      }
    }
  }

  private getNodesAndEdges() {
    const nodes: any[] = [];
    const edges: any[] = [];

    this.pages.forEach(page => {
      this.createPageAndFileNodes(page, nodes, edges);
      this.createCategoryNodes(page, 'standard', nodes, edges);
      this.createCategoryNodes(page, 'extended', nodes, edges);
    });

    return { nodes, edges };
  }
  private initializeNetwork(container: HTMLElement, nodesAndEdges: any, options: any): void {
    this.network = new Network(container, nodesAndEdges, options);
  }

  private addClickHandlers(network: any) {
    network.on('click', (params: { nodes: any[]; }) => {
      const selectedNodeId = params.nodes[0];[[[]]]
      if (selectedNodeId === undefined) {
        return;
      }

      let text = this.pageTextMap.get(selectedNodeId);
      if (text != undefined && text.length > 0) {
        this.openDialog(text)
      } else {
        // get all connected nodes
        
        const connectedNodes = this.network!.getConnectedNodes(selectedNodeId);
        let text = "";
        if (connectedNodes.length >= 2) {
          text = "There are " + connectedNodes.length + " pages with this category:";
          text += "<ul>";
          for (const connectedNode of connectedNodes) {
              // get only h2 element
              const pageText = this.pageTextMap.get(connectedNode as string);
              const h2 = pageText?.match(/<h2>(.*?)<\/h2>/);
              if (h2 != null && h2.length > 1) {
                text += "<li>" + h2[1] + "</li>";
              }
          }
          text += "</ul>";
        }
        
        let highlightText = "";
        
        const lastDashIndex = selectedNodeId.lastIndexOf("-");
        if (lastDashIndex > 0) {
          highlightText = selectedNodeId.substring(lastDashIndex + 1);
        }

        
        for (const connectedNode of connectedNodes) {
            let nodeText = this.pageTextMap.get(connectedNode as string);
            if (nodeText != undefined && nodeText.length > 0) {
              nodeText = nodeText.replace(new RegExp(highlightText, 'gi'), '<span class="bold">$&</span>');
              console.log("selectedNodeId: " + selectedNodeId + " connectedNode: " + connectedNode + " nodeText: " + nodeText + " highlightText: " + highlightText + "")
              text += nodeText + "<br>";
            }
        }
        this.openDialog(text)
      }

    });
  }

  private createPageAndFileNodes(page: any, nodes: any[], edges: any[]) {
    const pageNode = {
      id: page.pageNumber + "-" + page.fileName,
      label: `Page ${page.pageNumber} of ${page.fileName}`,
      icon: {
        face: 'Material Icons',
        code: '\ue24d',
        size: 100,
        color: '#2B7CE9',
      },
      group: 'page'
    };

    this.pageTextMap.set(page.pageNumber + "-" + page.fileName, "<h2>"+page.fileName + "(Page " + page.pageNumber + ") " + "</h2>" + page.text);

    if (!this.elementExists(page.pageNumber + "-" + page.fileName)) {
      nodes.push(pageNode);
    }
  }

  private getNetworkOptions() {
    return {
      nodes: {
        shape: 'dot',
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
          stabilization: false,
          solver: "repulsion",
          repulsion: {
            nodeDistance: 600
          }
        },
        interaction: {
          dragView: true
        },
    };
  }

  elementExists(identifier: string): boolean {
    if (this.createdElements.has(identifier)) {
      return true;
    } else {
      this.createdElements.add(identifier);
      return false;
    }
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
  openDialog(content: string): void {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      data: { content: content }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'app-dialog-content',
  template: `
    <mat-dialog-content class="mat-typography" innerHTML="{{data.content}}">
    </mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Close</button>
    </div>
  `,
})
export class DialogContentComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { content: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}