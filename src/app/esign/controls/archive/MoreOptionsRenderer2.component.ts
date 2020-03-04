import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';

@Component({
    template: `<button mat-icon-button [matMenuTriggerFor]="posXMenu" class="mat-24" aria-label="Open x-positioned menu">
    <mat-icon>more_vert</mat-icon>
  </button>
  <mat-menu xPosition="before" #posXMenu="matMenu">
    <button mat-menu-item [disabled]="false" (click)="invokeParentMethod('unarchive',case)">
      <mat-icon>restore_page</mat-icon>
      Unarchive
    </button>
    <button mat-menu-item [disabled]="false" (click)="invokeParentMethod('delete',case)">
    <mat-icon>delete</mat-icon>
    Delete
  </button>
  </mat-menu>`,
    styles: [
        `.remindericon{
            margin-left: 15px;
        }`
    ]
})

export class MoreOptionsRenderer2Component implements ICellRendererAngularComp {
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
