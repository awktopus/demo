import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-viewbutton-renderer2',
  template: `
    <button mat-icon-button style="border: none" (click)="onClick($event)"
    matTooltip="view pdf">
     <mat-icon>visibility</mat-icon>
    </button>
   `
  })

 export class CaseReviewDocViewButtonRendererComponent implements ICellRendererAngularComp {
  params;
  label: string;
  data: any;
  agInit(params): void {
    this.params = params;
    this.data = params.data;
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
