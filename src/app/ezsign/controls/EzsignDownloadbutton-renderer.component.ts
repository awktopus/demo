import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `
    <button mat-icon-button style="border: none" *ngIf='ezSignDoc.status ==="Signed"'
    (click)="invokeParentMethod()" matTooltip="Download signed document">
    <mat-icon>get_app</mat-icon>
   </button>
   `
})

export class EzsignDownloadButtonRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public ezSignDoc: any;
    agInit(params: any): void {
        this.params = params;
        this.ezSignDoc = this.params.data;
    }

    public invokeParentMethod() {
        this.params.context.componentParent.downloadEzSignDocument(this.ezSignDoc);
    }

    refresh(): boolean {
        return false;
    }
}
