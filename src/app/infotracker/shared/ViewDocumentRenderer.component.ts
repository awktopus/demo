
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `<mat-icon class='docicon' mdbRippleRadius
    (click)="invokeParentMethod()">visibility</mat-icon>
    `,
    styles: [
        `.docicon{
            margin-top:5px; /* optional */
            margin-right:25px; /* optional */
        }`
    ]
})
export class ViewDocumentRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public documentRecord: any;

    agInit(params: any): void {
        this.params = params;
        this.documentRecord = params.data;
    }

    public invokeParentMethod() {
        this.params.context.componentParent.viewDocument(this.documentRecord.docId);
    }

    refresh(): boolean {
        return false;
    }
}
