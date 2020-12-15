import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `
    <button mat-icon-button style="border: none"
    *ngIf='usTaxDoc.caseStatus !=="Signed" &&
    usTaxDoc.isSecondarySignerForm && !usTaxDoc.isPaperSignForm'
    (click)="invokeParentMethod(usTaxDoc)" matTooltip="Start eSign">
    <mat-icon>create</mat-icon>
   </button>
   `
})

export class USTaxSecondarySigningRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public usTaxDoc: any;
    agInit(params: any): void {
        this.params = params;
        this.usTaxDoc = this.params.data;
    }

    public invokeParentMethod(usTaxDoc) {
        console.log(this.params);
        this.params.context.componentParent.startReceiverUSTaxSign(usTaxDoc);
    }

    refresh(): boolean {
        return false;
    }
}
