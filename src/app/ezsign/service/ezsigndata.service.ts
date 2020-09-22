import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EsignAuthService } from '../../esign/service/esignauth.service';
import { EZSignDocResource, EzSignClientReminder, EZSignDocSigner } from '../../esign/beans/ESignCase';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class EzsigndataService implements Resolve<any> {

  onCategoriesChanged: BehaviorSubject<any>;
  // public baseurl = environment.apiEsignLink;
  // this is pass along the ezsign document information between components
  private _ezsignDocHistory: BehaviorSubject<EZSignDocResource> = new BehaviorSubject((new EZSignDocResource()));
  public readonly cur_ezsignDocHistory: Observable<EZSignDocResource> = this._ezsignDocHistory.asObservable();



  constructor(private http: HttpClient, public auth: EsignAuthService) {
    // Set the defaults
    this.onCategoriesChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getCategories(),
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  /**
   * Get categories
   *
   * @returns {Promise<any>}
   */
  getCategories(): Promise<any> {
    const url = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() + '/sender/'
      + this.auth.getUserID() + '/alldocuments';
    return new Promise((resolve, reject) => {
      this.http.get(url, this.auth.getESignOptions())
        .subscribe((response: any) => {
          this.onCategoriesChanged.next(response);
          resolve(response);
        }, reject);
    });
  }


  newEzSignDocHistory(ezSignDocHistory: EZSignDocResource) {
    console.log('inside Ezsigndataservice');
    console.log(ezSignDocHistory);
    this._ezsignDocHistory.next(ezSignDocHistory);
  }

  getEZSignDocuments(): Observable<any> {
    const url = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() + '/sender/'
      + this.auth.getUserID() + '/alldocuments';
    return this.http.get(url, this.auth.getESignOptions());
  }

  createNewEZSignDocument(fileToUpload: File | FileList) {
    console.log('createNewEZSignDocument');
    console.log(fileToUpload);
    // let ff: File;
    // if (fileToUpload instanceof (FileList)) {
    //   ff = fileToUpload.item(0);
    // } else {
    //   ff = fileToUpload;
    // }
    // console.log('ff');
    // console.log(ff);
    const formData: FormData = new FormData();
    formData.append('orgunit', this.auth.getOrgUnitID());
    formData.append('sender', this.auth.getUserID());
    formData.append('firstName', this.auth.getUserFirstName());
    formData.append('lastName', this.auth.getUserLastName());
    formData.append('email', this.auth.getUserEmail());

    if (fileToUpload instanceof (FileList)) {
      // ff = fileToUpload.item(0);
      let tff: File;
      console.log('sender uploaded multiple files');
      for (let i = 0; i < fileToUpload.length; i++) {
        tff = fileToUpload.item(i);
        formData.append('file', tff, tff.name);
        console.log(tff.name);
      }
    } else {
      let ff: File;
      console.log('sender uploaded single file');
      ff = fileToUpload;
      console.log(ff);
      formData.append('file', ff, ff.name);
      console.log(fileToUpload.name);
    }

    console.log(formData.getAll('orgunit'));
    console.log(formData.getAll('sender'));
    console.log(formData.getAll('firstName'));
    console.log(formData.getAll('lastName'));
    console.log(formData.getAll('email'));
    console.log(formData);
    return this.http.post(this.auth.baseurl + '/ezsign/document', formData, this.auth.getEZSignOptions());
  }

  deleteEZSignDocument(trackingId: string) {
    return this.http.delete(this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() +
      '/sender/' + this.auth.getUserID() +
      '/tracking/' + trackingId + '/delete', this.auth.getESignOptions());
  }

  getEZSignSigners(trackingId: string): Observable<any> {
    console.log('getEZSignSigners');
    const url = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() + '/sender/'
      + this.auth.getUserID() + '/tracking/' + trackingId + "/signers";
    return this.http.get(url, this.auth.getESignOptions());
  }

  GetPageSignerData(trackingId: string, docId: string, seqNo: string): Observable<any> {
    console.log('calling getPdfFormMirrorImage api:' + docId + ',' + seqNo);
    const url: string = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() + '/sender/' +
      this.auth.getUserID() + '/tracking/' + trackingId + '/document/' + docId + '/page/' + seqNo + '/mirrorimage'
    console.log(url);
    return this.http.get(url, this.auth.getESignOptions());
  }

  getEZSignPdfFormMirrorImageByTrackingId(trackingId: string): Observable<any> {
    console.log('calling getEZSignPdfFormMirrorImageByTrackingId api:' + trackingId);
    const url: string = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() + '/sender/' +
      this.auth.getUserID() + '/tracking/' + trackingId + '/mirrorimage'
    console.log(url);
    return this.http.get(url, this.auth.getESignOptions());
  }

  addNewSigner(trackingId: string, newSigner: any): Observable<any> {
    console.log('addNewSigner:');
    console.log(trackingId);
    console.log(newSigner);
    return this.http.post(this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() + '/sender/' +
      this.auth.getUserID() + '/tracking/' + trackingId + '/signer',
      newSigner, this.auth.getESignOptions());
  }

  deleteSigner(trackingId: string, signerId: string): Observable<any> {
    console.log('deleteSigner:' + trackingId + ";" + signerId);
    const url = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() + '/sender/' +
      this.auth.getUserID() + '/tracking/' + trackingId + '/signer/' + signerId + '/delete';
    console.log('url:' + url);
    return this.http.delete(url, this.auth.getESignOptions());
  }

  getOrganizationEZSignSigners() {
    console.log('calling getOrganizationEZSignSigners server api');
    const url: string = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID()
      + '/sender/' + this.auth.getUserID() + '/signers';
    return this.http.get(url, this.auth.getESignOptions());
  }

  getOrganizationEZSignSignersBySearchToken(searchToken: string) {
    console.log('calling getOrganizationEZSignSignersBySearchToken server api');
    const url: string = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID()
      + '/sender/' + this.auth.getUserID() + '/searchtoken/' + searchToken;
    return this.http.get(url, this.auth.getESignOptions());
  }

  addFieldToEZSignPage(trackingId: string, docId: string,
    pageSeqNo: number, newFieldInfo: any): Observable<any> {
    console.log('AddFieldToEZSignPage:');
    console.log(trackingId);
    console.log(newFieldInfo);
    return this.http.post(this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() + '/sender/' +
      this.auth.getUserID() + '/tracking/' + trackingId + '/document/' + docId
      + '/page/' + pageSeqNo + '/addfield',
      newFieldInfo, this.auth.getESignOptions());
  }

  deleteFieldFromEZSignPage(trackingId: string, docId: string,
    pageSeqNo: number, fieldSeqNo: number, fieldTypeId: number): Observable<any> {
    console.log('deleteFieldFromEZSignPage:');
    console.log(trackingId);
    console.log(docId);
    console.log(pageSeqNo);
    console.log(fieldSeqNo);
    return this.http.delete(this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID()
      + '/sender/' + this.auth.getUserID() + '/tracking/' + trackingId +
      '/document/' + docId + '/page/' + pageSeqNo + '/field/' + fieldSeqNo + '/fieldtype/' + fieldTypeId
      + '/deletefield',
      this.auth.getESignOptions());
  }

  sendInviteToSigners(trackingId: string, coverLetterInfo: any): Observable<any> {
    console.log('calling sendInviteToSigners api:' + trackingId);
    const url: string = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID()
      + '/sender/' + this.auth.getUserID() + '/tracking/' + trackingId + '/invitesigners'
    console.log(url);
    return this.http.post(url, coverLetterInfo, this.auth.getESignOptions());
  }

  getEzSignHistoryData(trackingId: string): Observable<any> {
    console.log('calling getEzSignHistoryData api:' + trackingId);
    const url: string = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID()
      + '/sender/' + this.auth.getUserID() + '/tracking/' + trackingId + '/history'
    console.log(url);
    return this.http.get(url, this.auth.getESignOptions());
  }
  getPDFBlob(url: string) {
    const opps = this.auth.getESignOptionswithoutElToken();
    opps['responseType'] = 'arraybuffer';
    console.log('get content url:' + url);
    return this.http.get(url, opps);
  }

  GetSignerData(trackingId: string): Observable<any> {
    console.log('calling GetSignerData api:' + trackingId);
    const url: string = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() + '/sender/' +
      this.auth.getUserID() + '/tracking/' + trackingId + '/signerdata'
    console.log(url);
    return this.http.get(url, this.auth.getESignOptions());
  }

  GetCoverLetter(orgUnitId: string, templateName: string): Observable<any> {
    const url = this.auth.baseurl + '/Configs/coverletter/orgunit/' + orgUnitId +
      '/template/' + templateName;
    return this.http.get(url, this.auth.getESignOptions());
  }

  getEZSignDocs() {
    const url = this.auth.baseurl + "/EZSign/orgunit/" + this.auth.getOrgUnitID() + "/receiver/"
      + this.auth.getUserID() + "/alldocuments";
    return this.http.get(url, this.auth.getESignOptions());
  }

  postEzsignAgreementAudit(docId, pageSeq) {
    const json = {
      "ClientId": this.auth.getUserID(),
      "DocId": docId,
      "PageSeqNo": pageSeq,
      "Agreement": "",
      "IpAddress": "001.01.00.00",
      "IsAgreementAccepted": "N"
    }
    const url = this.auth.baseurl + '/EZSign/agreement/audit';
    return this.http.post(url, json, this.auth.getESignOptions());
  }
  postSubmitSignCap(json) {
    const url = this.auth.baseurl + '/EZSign/receiver/' + this.auth.getUserID() + '/formsubmit';
    return this.http.post(url, json, this.auth.getESignOptions());
  }
  GetOrganizationGuestContacts() {
    console.log('calling GetOrganizationGuestContacts server api');
    const url: string = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID()
      + '/sender/' + this.auth.getUserID() + '/guestcontacts';
    return this.http.get(url, this.auth.getESignOptions());
  }

  saveScheduleClientReminder(clientReminder: EzSignClientReminder): Observable<any> {
    let ezSignTrackingId: string;
    let recurrenceInDays: number;
    let subject: string;
    let body: string;
    let cpaid: string;
    let sendReminderNow: string;
    let signers: EZSignDocSigner[];
    let count = 0;
    if (clientReminder) {
      ezSignTrackingId = clientReminder.ezSignTrackingId;
      recurrenceInDays = clientReminder.recurrenceInDays;
      signers = clientReminder.signers;
      subject = clientReminder.subject;
      body = clientReminder.body;
      cpaid = this.auth.getUserID();
      sendReminderNow = clientReminder.sendReminderNow;
      count = count + 1;
    }
    const url = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID()
      + '/sender/' + this.auth.getUserID() + '/schedulereminder/create';
    const json = {
      ezSignTrackingId: ezSignTrackingId,
      signers: signers,
      recurrenceInDays: recurrenceInDays,
      subject: subject,
      body: body,
      cpaid: cpaid,
      sendReminderNow: sendReminderNow,
    };
    console.log('save client reminder:' + json);
    return this.http.post(url, json, this.auth.getESignOptions());
  }

  getClientScheduleReminder(ezSignTrackingId: string): Observable<any> {
    const url: string = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID()
      + '/sender/' + this.auth.getUserID() + '/tracking/' + ezSignTrackingId + '/schedulereminder';
    return this.http.get(url, this.auth.getESignOptions());
  }

  updateScheduleClientReminder(clientReminder: EzSignClientReminder): Observable<any> {
    let ezSignTrackingId: string;
    let recurrenceInDays: number;
    let subject: string;
    let body: string;
    let cpaid: string;
    let sendReminderNow: string;
    let signers: EZSignDocSigner[];
    let count = 0;
    if (clientReminder) {
      ezSignTrackingId = clientReminder.ezSignTrackingId;
      recurrenceInDays = clientReminder.recurrenceInDays;
      signers = clientReminder.signers;
      subject = clientReminder.subject;
      body = clientReminder.body;
      cpaid = clientReminder.senderId;
      sendReminderNow = clientReminder.sendReminderNow;
      count = count + 1;
    }
    const url = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID()
      + '/sender/' + this.auth.getUserID() + '/tracking/' + ezSignTrackingId + '/schedulereminder/update';
    const json = {
      ezSignTrackingId: ezSignTrackingId,
      signers: signers,
      recurrenceInDays: recurrenceInDays,
      subject: subject,
      body: body,
      cpaid: cpaid,
      sendReminderNow: sendReminderNow,
    };
    console.log(json);
    return this.http.post(url, json, this.auth.getESignOptions());
  }

  deleteScheduleClientReminder(ezSignTrackingId: string): Observable<any> {
    console.log('delete schedule reminder:' + ezSignTrackingId);
    const url = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID()
      + '/sender/' + this.auth.getUserID() + '/tracking/' + ezSignTrackingId + '/schedulereminder/delete';
    console.log('url:' + url);
    return this.http.delete(url, this.auth.getESignOptions());
  }

  GetEZSignTrackingSource(trackingId: string): Observable<any> {
    console.log('calling GetEZSignTrackingSource api:' + trackingId);
    const url: string = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() + '/sender/' +
      this.auth.getUserID() + '/tracking/' + trackingId;
    console.log(url);
    return this.http.get(url, this.auth.getESignOptions());
  }
}
