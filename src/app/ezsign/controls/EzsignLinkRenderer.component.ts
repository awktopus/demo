import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `
    <button mat-icon-button color="primary"
    (click)="invokeParentMethod()" matTooltip="Add fields and send invite">
    {{params.value}}
   </button>
   `,
    styles: [
        `.caselink {
            font-size:10pt;
            color: green;
            text-decoration: underline
        }`
    ]
})

//  [disabled]='ezSignDocResource.status !="Uploaded"'
//  <span class="caselink" mdbRippleRadius (click)="invokeParentMethod()"
//     [disabled]='ezSignDocResource.status !="Uploaded"'>
//     {{params.value}}
//     </span>

export class EzsignLinkRendererComponent implements ICellRendererAngularComp {
    public params: any;
    ezSignDocResource: any;
    agInit(params: any): void {
        this.params = params;
        this.ezSignDocResource = params.data;
    }

    public invokeParentMethod() {
        console.log(this.params);
        this.params.context.componentParent.showEzSignDocument(this.params.value);
    }

    refresh(): boolean {
        return false;
    }
}
