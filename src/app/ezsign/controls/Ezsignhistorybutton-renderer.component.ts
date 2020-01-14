import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-historybutton-renderer',
  template: `
    <button mat-raised-button color="accent"
     (click)="onClick($event)">
    {{label}}
    </button>
   `
  })

export class EzsignHistoryButtonRendererComponent implements ICellRendererAngularComp {
// *ngIf='ezSignDocResource.status =="Uploaded"'
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
