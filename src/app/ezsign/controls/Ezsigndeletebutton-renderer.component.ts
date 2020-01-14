import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-deletebutton-renderer',
  template: `
    <button mat-raised-button style="border: none" [disabled]='ezSignDocResource.status !="Uploaded"'
     (click)="onClick($event)">
     <img src="../../../../assets/imgs/Recycle_Bin_Full.png" width="25" height="25">
    </button>
   `
  })
// <button class="delete-file" (click)="deleteAttachment(i)">
// <img src="../../../../assets/imgs/Recycle_Bin_Full.png">
// </button>

// <button mat-raised-button color="accent" [disabled]='ezSignDocResource.status !="Uploaded"'
// (click)="onClick($event)">
// <img src="../../../../assets/imgs/Recycle_Bin_Full.png">
// </button>


export class EzsignDeleteButtonRendererComponent implements ICellRendererAngularComp {
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
