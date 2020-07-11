
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `<mat-icon class='docicon' mdbRippleRadius
    (click)="invokeParentMethod()">insert_comment</mat-icon>
    `,
    styles: [
        `.docicon{
            margin-top:5px; /* optional */
            margin-right:25px; /* optional */
        }`
    ]
})
export class ViewReportRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public trackerRecord: any;

    agInit(params: any): void {
        this.params = params;
        this.trackerRecord = params.data;
    }

    public invokeParentMethod() {
        this.params.context.componentParent.viewHealthCheckSummary(this.trackerRecord.trackerId);
    }

    refresh(): boolean {
        return false;
    }
}
