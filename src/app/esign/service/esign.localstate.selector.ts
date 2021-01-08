import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class EsignLocalStateSelector  {
  private _eSignAccessToken: any = null;
  private _tokenuserId:any = null;
  constructor() {
  }

  clearData() {
    this._eSignAccessToken = null;
    this._tokenuserId=null;
  }

  getESignAccessToken(): any {
    if (this._eSignAccessToken) {
      return {
        accessToken: this._eSignAccessToken,
        tokenUserId: this._tokenuserId
      };
    } else {
      return null;
    }
  }

  setESignAccessToken(accessToken: any,userId:any) {
    this._eSignAccessToken = accessToken;
    this._tokenuserId=userId;
  }
}

