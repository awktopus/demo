// import { ESignActionHandler } from './../../tools/esign/providers/ESignActionHandler';
import { ELActionHandler } from "./ELActionHandler";
import { EsignActionHandler } from "./EsignActionHandler";

export class ActionHandler {
  static get Map(): any {
    var map: any = {};
    map["el"] = ELActionHandler;
    map["elesign"] = EsignActionHandler; //changes: esign->elesign
    return map;
  }


}
