import { ICardActionHandler } from "./ICardActionHandler";
import { Injectable } from '@angular/core';

@Injectable()
export class EsignActionHandler implements ICardActionHandler {
    private MODULE_NAME = "el";
    private VIEW_CONTACT = "viewContact";

    constructor() {

    }

    handle(actionName: string, args: any): Promise<boolean> {
        console.log("this is EsignActionHandler");

        let name = actionName.split(this.MODULE_NAME + ":")[1];
        if (name === this.VIEW_CONTACT) {
            // navigate to page
        }

        return Promise.resolve(true);
    }
}
