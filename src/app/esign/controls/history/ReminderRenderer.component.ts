import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `<mat-icon class='remindericon' color='{{colorstr}}' *ngIf='case.status=="ESign"
    && (case.clientReminderFlag =="Y"||case.clientReminderFlag =="N")' mdbRippleRadius
      (click)="invokeParentMethod(case.caseId)">scheduleicon
    </mat-icon>`,
    styles: [
        `.remindericon{
            margin-left: 15px;
        }`
    ]
})
export class ReminderRendererComponent implements ICellRendererAngularComp {
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
        this.params.context.componentParent.createClientReminder(cid);
    }

    refresh(): boolean {
        return false;
    }
}
