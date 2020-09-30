import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `
    <button mat-icon-button style="border: none" *ngIf='ezSignDoc.receiverSigningStatus !=="Signed"'
    (click)="invokeParentMethod(ezSignDoc.ezSignTrackingId)" matTooltip="Start ezsigning">
    <mat-icon>create</mat-icon>
   </button>
   `
})

//  [disabled]='ezSignDocResource.status !="Uploaded"'
//  <span class="caselink" mdbRippleRadius (click)="invokeParentMethod()"
//     [disabled]='ezSignDocResource.status !="Uploaded"'>
//     {{params.value}}
//     </span>

export class ReceiverEzsigningRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public ezSignDoc: any;
    agInit(params: any): void {
        this.params = params;
        this.ezSignDoc = this.params.data;
    }

    public invokeParentMethod(ezSignTrackingId) {
        console.log(this.params);
        this.params.context.componentParent.startReceiverEzsign(ezSignTrackingId);
    }

    refresh(): boolean {
        return false;
    }
}
