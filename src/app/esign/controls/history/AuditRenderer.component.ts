import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `<mat-icon class='remindericon' mdbRippleRadius
      (click)="invokeParentMethod(case.caseId)">list
    </mat-icon>`,
    styles: [
        `.remindericon{
            margin-left: 15px;
        }`
    ]
})
export class AuditRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public case: any;
    public colorstr: any = '';

    agInit(params: any): void {
        this.params = params;
        this.case = params.data;
        if (this.case.clientReminderFlag === 'Y') {
            this.colorstr = 'primary';
        }
    }

    public invokeParentMethod(cid) {
        this.params.context.componentParent.showAuditPopup(cid);
    }

    refresh(): boolean {
        return false;
    }
}
