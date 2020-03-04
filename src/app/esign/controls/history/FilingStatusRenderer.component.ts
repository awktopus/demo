import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `<mat-icon class='remindericon' color='{{colorstr}}' mdbRippleRadius
    matTooltip="Click to change the filing status"
      (click)="invokeParentMethod(case.caseId)">{{iconName}}
    </mat-icon>`,
    styles: [
        `.remindericon{
            margin-left: 15px;
        }`
    ]
})
export class FilingStatusRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public case: any;
    public colorstr: any = '';
    public iconName: any = '';
    agInit(params: any): void {
        this.params = params;
        this.case = params.data;
        if (this.case.status === 'e-File-Completed' || this.case.status === 'e-file-completed') {
            this.colorstr = 'primary';
            this.iconName = 'check_box';
        } else {
           // this.colorstr = 'warn';
            this.iconName = 'pause_circle_outline';
        }
    }

    public invokeParentMethod(cid) {
        this.params.context.componentParent.changeCaseFilingStatus(cid);
    }

    refresh(): boolean {
        return false;
    }
}
