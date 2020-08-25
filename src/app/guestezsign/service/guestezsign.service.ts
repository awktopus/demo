import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { GuestEZsignAuthService } from './guestezsignauth.service';

@Injectable()
export class GuestEzsignService implements Resolve<any> {

  constructor(private http: HttpClient, public auth: GuestEZsignAuthService) {
    // Set the defaults
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }
 getGuestEzsignDoc() {
    const url = this.auth.baseurl + "/guestezsign/orgunit/" + this.auth.getOrgUnitId() + "/receiver/"
    + this.auth.getSingerClientID() + "/tracker/" + this.auth.getEzSignTrackingId() + "/document";
    return this.http.get(url, this.auth.getGuestEzsignOptions());
  }

  postEzsignAgreementAudit(docId, seq): any {
    const url = this.auth.baseurl + "/guestezsign/agreement/audit";
    const json = {
      "ClientId": this.auth.getSingerClientID(),
      "DocId": docId,
      "PageSeqNo": seq,
      "Agreement": "",
      "IpAddress": "",
      "IsAgreementAccepted": ""
    };
    return this.http.post(url, json, this.auth.getGuestEzsignOptions());
  }

  getPDFBlob(url) {
    const opps = this.auth.getGuestEzsignNoContentOptions();
    opps['responseType'] = 'arraybuffer';
    console.log('get content url:' + url);
    return this.http.get(url, opps);
  }

  // http://localhost:55940/api/guestezsign/receiver/cf0907c8-dafd-4235-a793-5afce024b1f0/formsubmit
  postSubmitSignCap(json): any {
    // tslint:disable-next-line: max-line-length
    const url = this.auth.baseurl + "/guestezsign/orgUnit/" + this.auth.getOrgUnitId() + "/receiver/" + this.auth.getSingerClientID() + "/formsubmit";
    console.log(json);
    console.log(url);
    return this.http.post(url, json, this.auth.getGuestEzsignOptions());
  }

  refreshGuestUrl(token) {
    const url = this.auth.baseurl + "/guestezsign/resend/securelink";
    return this.http.post(url, {"token": token});
  }
}
