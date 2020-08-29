import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `<button mat-icon-button color='{{colorstr}}'
    *ngIf='ezSign.status=="Sent to recipient" && (ezSign.clientReminderFlag =="Y"||ezSign.clientReminderFlag =="N")' mdbRippleRadius
      (click)="invokeParentMethod(ezSign.ezSignTrackingId)">
      <mat-icon>scheduleicon</mat-icon>
    </button>`,
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
