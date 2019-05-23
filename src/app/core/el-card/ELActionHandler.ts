import { ICardActionHandler } from "./ICardActionHandler";
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

@Injectable()
export class ELActionHandler implements ICardActionHandler {
    private MODULE_NAME = "el";
    private VIEW_CONTACT = "viewContact";
    private VIEW_GROUP = "viewGroup";
    private VIEW_POST = "viewPost";

    constructor(private router: Router) {
    }

    handle(actionName: string, args: any, forceRefresh?: boolean): Promise<boolean> {
        console.log("this is ELActionHandler");
        if (args) {
            args = JSON.parse(args);
            console.log(args);
        }
        let name = actionName.split(this.MODULE_NAME + ":")[1];
        if (name === this.VIEW_CONTACT) {
        }
        return Promise.resolve(true);
    }


}
