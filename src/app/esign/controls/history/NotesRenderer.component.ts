
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `<mat-icon class='docicon' mdbRippleRadius
    (click)="invokeParentMethod()">create</mat-icon>
    `,
    styles: [
        `.docicon{
            margin-right:25px; /* optional */
        }`
    ]
})
export class NotesRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public case: any;

    agInit(params: any): void {
        this.params = params;
        this.case = params.data;
    }

    public invokeParentMethod() {
        this.params.context.componentParent.addNotes(this.case.caseId, this.case.notes);
    }

    refresh(): boolean {
        return false;
    }
}
