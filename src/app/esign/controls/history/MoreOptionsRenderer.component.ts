import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';

@Component({
    template: `<button mat-icon-button [matMenuTriggerFor]="posXMenu" class="mat-24" aria-label="Open x-positioned menu">
    <mat-icon>more_vert</mat-icon>
  </button>
  <mat-menu xPosition="before" #posXMenu="matMenu">
    <button mat-menu-item [disabled]="false" (click)="invokeParentMethod('archive',case)">
      <mat-icon>folder</mat-icon>
      Archive
    </button>
  </mat-menu>`,
    styles: [
        `.remindericon{
            margin-left: 15px;
        }`
    ]
})

export class MoreOptionsRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public case: any;
    agInit(params: any): void {
        this.params = params;
        this.case = params.data;
    }

    public invokeParentMethod(operation, cid) {
        this.params.context.componentParent.performMoreOperationAction(operation, cid);
    }

    refresh(): boolean {
        return false;
    }
}
