
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `<mat-icon class='addicon' mdbRippleRadius
    (click)="invokeParentMethod()">add_box</mat-icon>
    `,
    styles: [
        `.docicon{
            margin-right:5px; /* optional */
        }`
    ]
})
export class NewCaseRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public case: any;

    agInit(params: any): void {
        this.params = params;
        this.case = params.data;
    }

    public invokeParentMethod() {
        this.params.context.componentParent.createNewCaseFromPrevious(this.case.caseId);
    }

    refresh(): boolean {
        return false;
    }
}
