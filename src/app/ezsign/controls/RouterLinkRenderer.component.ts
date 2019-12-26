import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component} from '@angular/core';

@Component({
    template: `<span class="caselink" mdbRippleRadius (click)="invokeParentMethod()">{{params.value}}</span>`,
    styles: [
        `.caselink {
            font-size:10pt;
            color: green;
            text-decoration: underline
        }`
    ]
})
export class RouterLinkRendererComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    public invokeParentMethod() {
        console.log(this.params);
        this.params.context.componentParent.goToCase(this.params.value);
    }

    refresh(): boolean {
        return false;
    }
}
