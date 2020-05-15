import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-viewbutton-renderer',
  template: `
    <button mat-icon-button style="border: none" (click)="onClick($event)"
    matTooltip="View ezsign document">
     <mat-icon>visibility</mat-icon>
    </button>
   `
  })

 export class EzsignViewButtonRendererComponent implements ICellRendererAngularComp {
  params;
  label: string;
  ezSignDocResource: any;
  agInit(params): void {
    this.params = params;
    this.ezSignDocResource = params.data;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }
}
