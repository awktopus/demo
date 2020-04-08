import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class EsignLocalStateSelector  {
  private _eSignAccessToken: any = null;
  constructor() {
  }

  clearData() {
    this._eSignAccessToken = null;
  }

  getESignAccessToken(): { accessToken: string; } {
    if (this._eSignAccessToken) {
      return {
        accessToken: this._eSignAccessToken
      };
    } else {
      return null;
    }
  }

  setESignAccessToken(accessToken: any) {
    this._eSignAccessToken = accessToken;
  }
}

