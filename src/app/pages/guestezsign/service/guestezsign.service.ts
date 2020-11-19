import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { GuestEZsignAuthService } from './guestezsignauth.service';

@Injectable()
export class GuestEzsignService implements Resolve<any> {
  cacheData = {};
  constructor(private http: HttpClient, public auth: GuestEZsignAuthService) {
    // Set the defaults
  }

  setCacheData(key, value) {
    this.cacheData[key] = value;
  }

  getCacheData(key) {
    return this.cacheData[key];
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
    + this.auth.getSignerClientID() + "/tracker/" + this.auth.getEzSignTrackingId() + "/document";
    return this.http.get(url, this.auth.getGuestEzsignOptions());
  }

  postEzsignAgreementAudit(docId, seq): any {
    const url = this.auth.baseurl + "/guestezsign/agreement/audit";
    const json = {
      "ClientId": this.auth.getSignerClientID(),
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
    const url = this.auth.baseurl + "/guestezsign/orgUnit/" + this.auth.getOrgUnitId() + "/receiver/" + this.auth.getSignerClientID() + "/formsubmit";
    console.log(json);
    console.log(url);
    return this.http.post(url, json, this.auth.getGuestEzsignOptions());
  }

  refreshGuestUrl(token) {
    const url = this.auth.baseurl + "/guestezsign/resend/securelink";
    return this.http.post(url, {"token": token});
  }

  showEzsignPagePreview(trackId, docId, pageSeq) {
    const url = this.auth.baseurl + "/guestezsign/orgunit/" + this.auth.getOrgUnitId()
    + "/receiver/" + this.auth.getSignerClientID() + "/tracking/" + trackId
    + "/document/" + docId + "/page/" + pageSeq + "/signedpage/preview";
    this.getPDFBlob(url).subscribe(resp => {
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
     });
  }

  postPreSubmitEzsignPage(json) {
    // api/ezsign/orgunit/4a55653e-fcab-4736-91af-30f25ab208d3/receiver/db608b99-d878-428c-8f7a-3daad5fd596a/signedpage/presubmit
    const url = this.auth.baseurl + "/guestezsign/orgunit/" + this.auth.getOrgUnitId()
    + "/receiver/" + this.auth.getSignerClientID() + "/signedpage/presubmit" ;
    return this.http.post(url, json, this.auth.getGuestEzsignOptions());
  }

  previewEzsignDocPreview(trackId, docId) {
    const url = this.auth.baseurl + "/guestezsign/orgunit/" + this.auth.getOrgUnitId()
    + "/receiver/" + this.auth.getSignerClientID() + "/tracking/" + trackId
    + "/document/" + docId + "/signeddocument/preview";
    this.getPDFBlob(url).subscribe(resp => {
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
     });
  }

  finalizeSigning(trackId, docId) {
    const url = this.auth.baseurl + "/guestezsign/orgunit/" + this.auth.getOrgUnitId()
    + "/receiver/" + this.auth.getSignerClientID() + "/tracking/" + trackId
    + "/document/" + docId + "/signeddocument/finalsubmit";
    console.log(this.auth.getGuestEzsignOptions());
    return this.http.post(url, {}, this.auth.getGuestEzsignOptions());
  }

  downloadEzsignDocument(trackingId: string, attachment: any): any {
    console.log('downloadEzsignDocument service api call..');

    const url = this.auth.baseurl + "/guestezsign/orgunit/" + this.auth.getOrgUnitId()
    + "/user/" + this.auth.getSignerClientID() + "/tracking/" + trackingId
    + "/signeddocument";

    console.log(url);
    this.getPDFBlob(url).subscribe(resp => {
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      console.log('set pdf:' + fileURL);
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = fileURL;
      link.download = attachment;
      link.click();
    });
  }

}
