import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `<mat-icon class='remindericon' color='{{colorstr}}' *ngIf='ezSign.status=="ESign"
    && (ezSign.clientReminderFlag =="Y"||ezSign.clientReminderFlag =="N")' mdbRippleRadius
      (click)="invokeParentMethod(ezSign.ezSignTrackingId)">scheduleicon
    </mat-icon>`,
    styles: [
        `.remindericon{
            margin-left: 15px;
        }`
    ]
})
export class EzSignReminderRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public ezSign: any;
    public colorstr: any = '';

    agInit(params: any): void {
        this.params = params;
        this.ezSign = params.data;
        if (this.ezSign.clientReminderFlag === 'Y') {
            this.colorstr = 'primary';
        }
    }

    public invokeParentMethod(ezSignTrackingId) {
        this.params.context.componentParent.createClientReminder(ezSignTrackingId);
    }

    refresh(): boolean {
        return false;
    }
}
