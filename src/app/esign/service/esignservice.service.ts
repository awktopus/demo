import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ESignCase, ESignDoc, ClassifyPage, ESignCPA, ClientReminder, ESignClient } from '../beans/ESignCase';
import { LocalStorageService } from '../../core/localStorage/local-storage.service';
import { environment } from '../../../environments/environment';
import { EsignAuthService } from './esignauth.service';

@Injectable()
export class EsignserviceService {
  // public baseurl = environment.apiEsignLink;
  // this is pass along the case information between components
  private _case: BehaviorSubject<ESignCase> = new BehaviorSubject((new ESignCase()));
  public readonly cur_case: Observable<ESignCase> = this._case.asObservable();
  esignauth = null;
  CPAID = '';  // we need to change this later
  esign_key = 'ESIGN_AUTH';
  role: string;
  constructor(private http: HttpClient, public auth: EsignAuthService) {
  }

  getEsignReviewForms(caseId) {
    const url = this.auth.baseurl + '/Clients/case/' + caseId + '/esign/reviewforms';
    return this.http.get(url, this.auth.getESignOptions());
  }
  getUnsignedForm(clientId, caseID) {
    const url = this.auth.baseurl + '/Clients/case/' + caseID + '/client/' + clientId + '/unesignforms';
    return this.http.get(url, this.auth.getESignOptions());
  }
  validateSecAnswer(orgid, clientId, caseId, answerId, answer) {
    // const url = this.auth.baseurl +'/Clients/identity/client/'+clientId+'/answer/'+answerId+'/validate';
    const url = this.auth.baseurl + '/Clients/identity/orgunitId/' + orgid + '/client/' + clientId +
      '/case/' + caseId + '/answer/' + answerId + '/validate';
    return this.http.post(url, { answer: answer }, this.auth.getESignOptions());
  }
  validateSecAnswers(orgid, clientId, caseId, data) {
    const url = this.auth.baseurl + '/Clients/identity/orgunitId/' + orgid + '/client/' + clientId +
      '/case/' + caseId + '/answers/validate';
    return this.http.post(url, data, this.auth.getESignOptions());
  }
  getSecurityQuestions(clientId, caseId, type) {
    const url = this.auth.baseurl + '/Clients/identity/case/' + caseId +
      '/orgUnitId/' + this.auth.getOrgUnitID() + '/client/' + clientId + '/type/' + type + '/question';
    console.log('get Security Questions...');
    return this.http.get(url, this.auth.getESignOptions());
  }

  getCoverLetters() {
    const url = this.auth.baseurl + '/Configs/coverletter/' + this.auth.getOrgUnitID();
    return this.http.get(url, this.auth.getESignOptions());
  }
  updateCase(c: ESignCase) {
    this._case.next(c);
  }

  // esign config
  getEsignConfig() {
    return this.http.get(this.auth.baseurl + '/configs/', this.auth.getESignOptions());
  }

  getCPAs() {
    // cpas/orgunitid/<OrgUnitId>/staff
    console.log(this.auth.baseurl + '/cpas/orgunitid/' + this.auth.getOrgUnitID() + '/staff');
    return this.http.get(this.auth.baseurl + '/cpas/orgunitid/' + this.auth.getOrgUnitID() + '/staff', this.auth.getESignOptions());
  }

  // getClients(cpaID) {
  //  return this.http.get(this.auth.baseurl + '/Clients/staff/' + cpaID + '/clients', this.auth.getESignOptions());
  // }

  saveCase(casejson) {
    return this.http.post(this.auth.baseurl + '/Cases', casejson, this.auth.getESignOptions());
  }

  updateCaseHeader(casejson) {
    const cid: string = this._case.getValue().caseId;
    return this.http.put(this.auth.baseurl + '/Cases/' + cid, casejson, this.auth.getESignOptions());
  }
  uploadFile(caseId: string, type: string, fileToUpload: File | FileList) {
    let ff: File;
    if (fileToUpload instanceof (FileList)) {
      ff = fileToUpload.item(0);
    } else {
      ff = fileToUpload;
    }
    const formData: FormData = new FormData();
    console.log(caseId, type, ff.name);
    formData.append('caseid', caseId);
    formData.append('uploadfiletype', type);
    formData.append('ff', ff, ff.name);

    console.log(formData.getAll('caseid'));
    console.log(formData.getAll('uploadfiletype'));
    return this.http.post(this.auth.baseurl + '/Contents', formData, this.auth.getESignOptionswithoutElToken());
  }
  updateDocs(docs: ESignDoc[], type: string, removeDocID?: string) {
    console.log('type', type);
    const c: ESignCase = this._case.getValue();
    switch (type) {
      case 'review':
        c.reviewDocs = docs;
        break;
      case 'paper':
        c.paperDocs = docs;
        break;
      case 'esign':
        c.esignDocs = docs;
        break;
      case 'paymentvoucher':
        c.paymentDocs = docs;
        break;
      case 'k1':
        c.k1Docs = docs;
        break;
      default:
        break;
    }
    if (removeDocID) {
      console.log(c);
      this.removeDocPages(removeDocID, c);
    }
    this.updateCase(c);
  }

  addESignDoc(newdoc) {
    const c: ESignCase = this._case.getValue();
    const edoc = new ESignDoc();
    edoc.docId = newdoc.docId;
    edoc.fileName = newdoc.fileName;
    edoc.type = 'esign';
    if (!c.esignDocs) {
      c.esignDocs = [];
      c.esignDocs.push(edoc);
    } else {
      c.esignDocs.push(edoc);
    }
    this.updateCase(c);
  }
  removeDocPages(docID, cc: ESignCase) {
    if (cc.cpages) {
      const nc: ClassifyPage[] = [];
      cc.cpages.forEach(ele => {
        if (ele.docId !== docID) {
          nc.push(ele);
        }
        cc.cpages = nc;
      });
    }
    if (cc.upages) {
      const nc: ClassifyPage[] = [];
      cc.upages.forEach(ele => {
        if (ele.docId !== docID) {
          nc.push(ele);
        }
        cc.upages = nc;
      });
    }
  }
  deleteDoc(docId: string): any {
    return this.http.delete(this.auth.baseurl + '/Contents/' + docId, this.auth.getESignOptionswithoutElToken());
  }
  deletePage(docId: string, pageSeq: number): any {
    return this.http.delete(this.auth.baseurl + '/Contents/' + docId + '/' + pageSeq, this.auth.getESignOptions());
  }
  classify(caseID: string, cpaID: string) {
    const jsondata = {
      CpaId: cpaID
    };
    return this.http.put(this.auth.baseurl + '/Classifications/' + caseID, jsondata, this.auth.getESignOptions());
  }

  updateClassificationPages(cdocs: ESignDoc[]) {
    const c: ESignCase = this._case.getValue();
    c.cpages = [];
    c.upages = [];
    if (cdocs) {
      cdocs.forEach(ele => {
        if (ele.pages) {
          ele.pages.forEach(e => {
          e.docId = ele.docId; if (e.formCode !== '') {
            c.cpages.push(e);
          } else { c.upages.push(e); }
          });
        }
      });
    }
    this.updateCase(c);
  }

  mergeCaseHeader(cheader: ESignCase) {
    const c: ESignCase = this._case.getValue();
    // update only headers
    c.caseId = cheader.caseId;
    c.status = cheader.status;
    c.subCate = cheader.subCate;
    c.cate = cheader.cate;
    c.recipientClients = cheader.recipientClients;
    c.copyCpas = cheader.copyCpas;
    c.primarySigner = cheader.primarySigner;
    c.secondarySigner = cheader.secondarySigner;
    c.returnName = cheader.returnName;
    c.taxReturnIdNo = cheader.taxReturnIdNo;
    c.taxYear = cheader.taxYear;
    this.updateCase(c);
  }

  classifyDocForm(docId: string, pageNo: number, form: string) {
    const json = { formCode: form };
    const url = this.auth.baseurl + '/Classifications/' + docId + '/' + pageNo;
    return this.http.put(url, json, this.auth.getESignOptions());
  }

  getMyCases() {
    const urlstr: string = this.auth.baseurl + '/Cases/OrgUnitId/' + this.auth.getOrgUnitID() + '/staff/' + this.auth.getUserID();
    return this.http.get(urlstr, this.auth.getESignOptions())
  }
  getMyReviewCases() {
    const urlstr: string = this.auth.baseurl + '/Cases/OrgUnitId/' + this.auth.getOrgUnitID() +
      '/staff/' + this.auth.getUserID() + '/reviewcases';
    return this.http.get(urlstr, this.auth.getESignOptions())
  }
  getAllCases() {
    // console.log(this.auth.getESignOptions().headers);
    // console.log('get User Id:' + this.auth.getUserID() );
    // console.log('get Current OU:' + this.auth.getOrgUnitID() );
    // return this.http.get(this.auth.baseurl + '/Cases', this.auth.getESignOptions());
    const urlstr: string = this.auth.baseurl + '/Cases/OrgUnitId/' + this.auth.getOrgUnitID();
    console.log('step 2.1');
    return this.http.get(urlstr, this.auth.getESignOptions())
  }
  getESignCase(caseId: string) {
    console.log('inside the service:' + caseId);
    console.log(this.auth.baseurl + '/Cases/' + caseId);
    return this.http.get(this.auth.baseurl + '/Cases/' + caseId, this.auth.getESignOptions());
  }

  buildCoverLetter(cljson) {
    const caseID: string = this._case.getValue().caseId;
    return this.http.post(this.auth.baseurl + '/Cases/' + caseID, cljson, this.auth.getESignOptions());
  }

  updateCoverLetter(docs: ESignDoc[]) {
    const c: ESignCase = this._case.getValue();
    c.coverLetters = docs;
    this.updateCase(c);
  }

  saveNote(caseId: string, newnote: string) {
    const json = { caseId: caseId, notes: newnote };
    return this.http.put(this.auth.baseurl + '/Cases/notes', json, this.auth.getESignOptions());
  }

  rejectCase(caseId: string, rejectReason: string) {
    const json = { caseId: caseId, notes: rejectReason };
    console.log('calling rejectCase API:');
    return this.http.put(this.auth.baseurl + '/Cases/reject', json, this.auth.getESignOptions());
  }

  getUserCases(cpaId: string, type: string, id: string) {
    const cpaurl = this.auth.baseurl + '/Cases/OrgUnitId/' + this.auth.getOrgUnitID() + '/staff/' + cpaId;
    const clienturl = this.auth.baseurl + '/Cases/OrgUnitId/' + this.auth.getOrgUnitID() + '/Clients/' + cpaId;
    if (type === 'cpa') {
      console.log(cpaurl + '/' + id);
      return this.http.get(cpaurl + '/' + id, this.auth.getESignOptions());
    } else {
      console.log(clienturl + '/' + id);
      return this.http.get(clienturl + '/' + id, this.auth.getESignOptions());
    }
  }

  getPDFBlob(url: string) {
    const opps = this.auth.getESignOptionswithoutElToken();
    opps['responseType'] = 'arraybuffer';
    console.log('get content url:' + url);
    return this.http.get(url, opps);
  }

  updateCaseStatus(caseID: string, status: string) {
    this.http.put(this.auth.baseurl + '/Cases/' + caseID + '/status',
      { 'status': status }, this.auth.getESignOptions()).subscribe(resp => {
        this.updateCaseStatusLocal(status);
      });
  }

  updateCaseStatusLocal(status: string) {
    const c: ESignCase = this._case.getValue();
    c.status = status;
    this.updateCase(c);
  }

  getReviewers() {
    const staffId = this.auth.getUserID();
    // cpas/OrgUnitId/<OrgUnitId>/reviewers
    return this.http.get(this.auth.baseurl + '/cpas/OrgUnitId/' + this.auth.getOrgUnitID() + '/staff', this.auth.getESignOptions());
  }

  sendToReview(caseID: string, reviewCPA: ESignCPA) {
    this.http.put(this.auth.baseurl + '/Cases/' + caseID + '/review',
      { 'ReviewCPA': reviewCPA }, this.auth.getESignOptions()).subscribe(resp => {
        this.updateCaseStatusLocal('Review');
      });
  }

  sendToESign(caseID: string) {
    this.http.put(this.auth.baseurl + '/Cases/' + caseID + '/sendtoclient',
      {
        Cpaid: this.auth.getUserID(),
        status: 'ESign'
      }, this.auth.getESignOptions()).subscribe(resp => {
        console.log(resp);
        this.updateCaseStatusLocal('ESign');
      })
  }

  getESignCases() {
    const url: string = this.auth.baseurl + '/clients/OrgUnitId/' +
      this.auth.getOrgUnitID() + '/client/' + this.auth.getUserID() + '/cases';
    return this.http.get(url, this.auth.getESignOptions())
  }

  getESignReviewPDF(caseID: string) {
    const url: string = this.auth.baseurl + '/clients/OrgUnitId/' +
      this.auth.getOrgUnitID() + '/client/' + this.auth.getUserID() + '/reviewforms/' + caseID;
    return this.http.get(url, this.auth.getESignOptions())
  }

  getSigningForm(caseId) {
    // Clients/case/CS1808280143/esignforms
    const url = this.auth.baseurl + '/Clients/case/' + caseId + '/esignforms';
    return this.http.get(url, this.auth.getESignOptions());
  }
  getESignForms(caseID: string) {
    const url: string = this.auth.baseurl + '/clients/OrgUnitId/' +
      this.auth.getOrgUnitID() + '/client/' + this.auth.getUserID() + '/esignforms/' + caseID;
    return this.http.get(url, this.auth.getESignOptions());
  }

  buildAgreementJson(docID: string, seq: number) {
    return {
      'ClientId': this.auth.getUserID(),
      'DocId': docID,
      'SeqNo': seq,
      'Agreement': 'Y',
      'IpAddress': '10.20.12.146'
    };
  }
  postESignAgreement(docID: string, seq: number) {
    const url: string = this.auth.baseurl + '/Clients/esign/audit';
    return this.http.post(url, this.buildAgreementJson(docID, seq), this.auth.getESignOptions());
  }

  getClientInfo(docID: string, seqNo: number) {
    const url: string = this.auth.baseurl + '/Clients/document/' + docID + '/form/' + seqNo + '/clientinfo';
    return this.http.get(url, this.auth.getESignOptions());
  }

  loadSignature(caseID: string, clientID: string) {
    const url: string = this.auth.baseurl + '/Clients/case/' + caseID + '/client/' + clientID + '/loadsignature';
    return this.http.get(url, this.auth.getESignOptions());
  }

  // Clients/esign/savesignature
  saveSignature(clientID: string, caseID: string, sigImg: string) {
    const url = this.auth.baseurl + '/Clients/esign/savesignature';
    const data = {
      CaseId: caseID,
      ClientId: clientID,
      DataUrl: sigImg
    }
    console.log(url);
    console.log(data);
    return this.http.post(url, data, this.auth.getESignOptions());
  }

  submitSignatureForm(jsonData: any) {
    const url = this.auth.baseurl + '/Clients/esign/formsubmit';
    return this.http.post(url, jsonData, this.auth.getESignOptions());
  }

  downloadESignedDoc(caseId: string): any {
    const url: string = this.auth.baseurl + '/Contents/Case/' + caseId + '/signedform';
    console.log(url);
    this.getPDFBlob(url).subscribe(resp => {
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      console.log('set pdf:' + fileURL);
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = fileURL;
      link.download = 'SignedTaxForm.pdf';
      link.click();
    });
  }

  updateCoverTemplate(jsonData: any) {
    const url = this.auth.baseurl + '/Configs/coverletter/' + this.auth.getOrgUnitID() + '/' + jsonData.templateID + '/update';
    const json = {
      OrgUnitId: this.auth.getOrgUnitID(),
      TemplateName: jsonData.TType,
      Content: jsonData.content,
      Inputs: jsonData.inputs,
      cpa: this.auth.getUserID()
    };
    console.log(url);
    console.log(json);
    return this.http.put(url, json, this.auth.getESignOptions());
  }

  createNewTemplate(jsonData: any) {
    // const url = this.auth.baseurl + '/Configs/coverletter/' + this.getOrgUnitID();
    const url = this.auth.baseurl + '/Configs/coverletter/';
    const json = {
      OrgUnitId: this.auth.getOrgUnitID(),
      TemplateName: jsonData.newTType,
      Content: jsonData.content,
      Inputs: jsonData.inputs
    };
    console.log(json);
    console.log(url);
    return this.http.post(url, json, this.auth.getESignOptions());
  }

  deleteCoverTemplate(templateID: any) {
    const url = this.auth.baseurl + '/Configs/coverletter/' + this.auth.getOrgUnitID() + '/' + templateID + '/delete';
    return this.http.delete(url, this.auth.getESignOptions());
  }

  sendCaseByEmail(jsonData: any) {
    const url = this.auth.baseurl + '/Clients/taxdocs/email';
    return this.http.post(url, jsonData, this.auth.getESignOptions());
  }

  uploadscanFile(caseID: string, dtype: string, fileToUpload: File | FileList) {
    let ff: File;
    if (fileToUpload instanceof (FileList)) {
      ff = fileToUpload.item(0);
    } else {
      ff = fileToUpload;
    }
    const formData: FormData = new FormData();
    console.log(caseID, dtype, ff.name);
    formData.append('caseid', caseID);
    formData.append('uploadfiletype', 'esign');
    formData.append('ff', ff, ff.name);
    formData.append('overrideflag', 'N');
    formData.append('cpaid', this.auth.getUserID());
    const url = this.auth.baseurl + '/Contents/upload/autoclassify';
    return this.http.post(url, formData, this.auth.getESignOptionswithoutElToken());
  }

  completeESignUpload(caseID: string, docID: string, json: any) {
    const url = this.auth.baseurl + '/Classifications/' + caseID + '/' + docID + '/autoclassify/complete';
    return this.http.post(url, json, this.auth.getESignOptions());
  }

  saveScheduleClientReminder(clientReminder: ClientReminder) {
    let caseId: string;
    let recurrenceInDays: number;
    let subject: string;
    let body: string;
    let cpaid: string;
    let sendReminderNow: string;
    let clients: ESignClient[];
    let count = 0;
    if (clientReminder) {
      caseId = clientReminder.caseId;
      recurrenceInDays = clientReminder.recurrenceInDays;
      clients = clientReminder.clients;
      subject = clientReminder.subject;
      body = clientReminder.body;
      cpaid = this.auth.getUserID();
      sendReminderNow = clientReminder.sendReminderNow;
      count = count + 1;
    }
    // const url = this.auth.baseurl + '/Clients/esign/schedulereminder/create';
    const url = this.auth.baseurl + '/Clients/case/' + caseId + '/schedulereminder/update';
    const json = {
      caseId: caseId,
      clients: clients,
      recurrenceInDays: recurrenceInDays,
      subject: subject,
      body: body,
      cpaid: cpaid,
      sendReminderNow: sendReminderNow,
    };
    console.log('save client reminder:' + json);
    return this.http.put(url, json, this.auth.getESignOptions());
  }

  getClientScheduleReminder(caseId: string) {
    const url: string = this.auth.baseurl + '/Clients/case/' + caseId + '/schedulereminder/';
    return this.http.get(url, this.auth.getESignOptions());
  }

  updateScheduleClientReminder(clientReminder: ClientReminder) {
    let caseId: string;
    let recurrenceInDays: number;
    let subject: string;
    let body: string;
    let cpaid: string;
    let sendReminderNow: string;
    let clients: ESignClient[];
    let count = 0;
    if (clientReminder) {
      caseId = clientReminder.caseId;
      recurrenceInDays = clientReminder.recurrenceInDays;
      clients = clientReminder.clients;
      subject = clientReminder.subject;
      body = clientReminder.body;
      cpaid = clientReminder.cpaId;
      sendReminderNow = clientReminder.sendReminderNow;
      count = count + 1;
    }
    const url = this.auth.baseurl + '/Clients/case/' + caseId + '/schedulereminder/update';
    const json = {
      caseId: caseId,
      clients: clients,
      recurrenceInDays: recurrenceInDays,
      subject: subject,
      body: body,
      cpaid: cpaid,
      sendReminderNow: sendReminderNow,
    };
    console.log(json);
    return this.http.post(url, json, this.auth.getESignOptions());
  }

  deleteScheduleClientReminder(caseId: string) {
    console.log('delete schedule reminder:' + caseId);
    const url = this.auth.baseurl + '/Clients/case/' + caseId + '/schedulereminder/delete';
    console.log('url:' + url);
    return this.http.delete(url, this.auth.getESignOptions());
  }

  getClientIdentityAnswerByClientOrgUnitId(orgUnitId: string, clientId: string) {
    const url: string = this.auth.baseurl + '/Clients/identity/orgUnitId/' + orgUnitId + '/client/' + clientId;
    return this.http.get(url, this.auth.getESignOptions());
  }

  getClientIdentityAnswer(clientId: string, ansId) {
    const url: string = this.auth.baseurl + '/Clients/identity/client/' + clientId + '/answer/' + ansId;
    return this.http.get(url, this.auth.getESignOptions())
  }
  saveClientIdentityAnswer(orgUnitId: string, clientId: string, orgQuestionId: string, cljson) {
    return this.http.post(this.auth.baseurl + '/Clients/identity/orgUnitId/' + orgUnitId + '/client/' + clientId
      + '/question/' + orgQuestionId + '/answer/new', cljson, this.auth.getESignOptions());
  }

  getOrgUnitActiveIdentityQuestion(orgUnitId: string) {
    const url: string = this.auth.baseurl + '/Clients/identity/orgunitid/' + orgUnitId + '/question/active';
    return this.http.get(url, this.auth.getESignOptions());
  }

  makeIdentityQuestionInactive(orgUnitId: string, orgQtnId: string) {
    const url = this.auth.baseurl + '/Clients/identity/orgunitid/' + orgUnitId +
      '/question/' + orgQtnId + '/inactive';
    return this.http.put(url, null, this.auth.getESignOptions());
  }

  getIdentityQuestions(orgUnitId: string) {
    const url: string = this.auth.baseurl + '/Configs/orgunitid/' + orgUnitId
      + '/identity/questions';
    return this.http.get(url, this.auth.getESignOptions());
  }

  saveOrgUnitIdentityQuestion(orgUnitId: string, cljson) {
    return this.http.post(this.auth.baseurl + '/Clients/identity/orgunitid/' +
      orgUnitId + '/question/new', cljson, this.auth.getESignOptions());
  }

  addNewIdentityQuestion(orgUnitId: string, cljson) {
    return this.http.post(this.auth.baseurl + '/Configs/orgunitid/' +
      orgUnitId + '/identity/question/new', cljson, this.auth.getESignOptions());
  }

  getEmailSettings(orgUnitId: string) {
    const url: string = this.auth.baseurl + '/Configs/orgunitid/' + orgUnitId + '/emailsettings';
    return this.http.get(url, this.auth.getESignOptions());
  }
  addUpdateEmailSettings(orgUnitId: string, emailSettingsJson) {
    return this.http.post(this.auth.baseurl + '/Configs/orgunitid/' +
      orgUnitId + '/emailsettings/addupdate', emailSettingsJson, this.auth.getESignOptions());
  }
  resetToDefaultSettings(orgUnitId: string) {
    return this.http.post(this.auth.baseurl + '/Configs/orgUnitId/' +
      orgUnitId + '/emailsettings/reset', null, this.auth.getESignOptions());
  }

  saveSignedPartyOption(caseId: string, docId: string, pageSeqNo: string, signedPartyjson: any) {
    return this.http.put(this.auth.baseurl + '/Cases/case/' + caseId + '/doc/' + docId + '/page/' + pageSeqNo +
      '/signedpartyoption/update', signedPartyjson, this.auth.getESignOptions());
  }
  getOrgSettings(orgUnitId: string) {
    const url: string = this.auth.baseurl + '/Configs/orgunitid/' + orgUnitId + '/orgsettings';
    return this.http.get(url, this.auth.getESignOptions());
  }
  addUpdateOrgSettings(orgUnitId: string, orgSettingsJson) {
    return this.http.post(this.auth.baseurl + '/Configs/orgunitid/' +
      orgUnitId + '/orgsettings/addupdate', orgSettingsJson, this.auth.getESignOptions());
  }

  getCaseActivityLog(caseId: string) {
    const url: string = this.auth.baseurl + '/Cases/' + caseId + '/activitylog';
    return this.http.get(url, this.auth.getESignOptions());
  }

  getEmailSettingsByType(orgUnitId: string, settingsType: string) {
    console.log('get email settings by type');
    const url: string = this.auth.baseurl + '/Configs/orgunitid/' + orgUnitId
      + '/emailsettings/settingstype/' + settingsType;
    return this.http.get(url, this.auth.getESignOptions());
  }

  updateCaseActivityLog(caseId, activityLogJson) {
    return this.http.put(this.auth.baseurl + '/Cases/' + caseId + '/activitylog/update',
      activityLogJson, this.auth.getESignOptions());
  }

  getOrgClientIdentiificationAnswerData(orgUnitId: string) {
    console.log('calling getOrgClientIdentiificationAnswerData');
    const url: string = this.auth.baseurl + '/Clients/orgunitid/' + orgUnitId
      + '/idAnswerData';
    return this.http.get(url, this.auth.getESignOptions());
  }

  saveClientIdentityAnswerData(orgUnitId, cliIdentifyAnswerData) {
    console.log('saveClientIdentityAnswerData:');
    console.log(cliIdentifyAnswerData);
    return this.http.put(this.auth.baseurl + '/Clients/orgUnitId/' + orgUnitId + '/saveClientIdAnswerData'
      , cliIdentifyAnswerData, this.auth.getESignOptions());
  }

  uploadNonEsignForm(clientId: string, caseId: string, docId: string, pageSeqNo: string, type: string, fileToUpload: File | FileList) {
    console.log('upload Non Esign form...')
    let ff: File;
    if (fileToUpload instanceof (FileList)) {
      ff = fileToUpload.item(0);
    } else {
      ff = fileToUpload;
    }
    const formData: FormData = new FormData();
    console.log(caseId, type, ff.name);
    formData.append('caseid', caseId);
    formData.append('uploadfiletype', type);
    formData.append('ff', ff, ff.name);
    formData.append('docid', docId);
    formData.append('pageseqno', pageSeqNo);
    formData.append('clientid', clientId);
    console.log(formData.getAll('caseid'));
    console.log(formData.getAll('uploadfiletype'));
    console.log(formData.getAll('ff'));
    console.log(formData.getAll('docid'));
    console.log(formData.getAll('pageseqno'));
    console.log(formData.getAll('clientid'));
    return this.http.post(this.auth.baseurl + '/Capture/upload/signedforms', formData,
    this.auth.getESignOptionswithoutElToken());
  }

  // IET related server api - start

  getCompanyTypes() {
    console.log('calling getCompanyTypes server api');
    const url: string = this.auth.baseurl + '/iet/Lookups/CompanyTypes';
    return this.http.get(url, this.auth.getESignOptions());
  }

  getClientCompanies(orgUnitId: string, clientId: string) {
    console.log('calling getClientCompanies server api');
    const url: string = this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' +
      orgUnitId + '/clientid/' + clientId + '/mycompanies';
    return this.http.get(url, this.auth.getESignOptions());
  }

  getCompanyStaff() {
    console.log('calling getCompanyStaff server api');
    const url: string = this.auth.baseurl + '/iet/Lookups/OrgUnitId/' + this.auth.getOrgUnitID() + '/staff';
    return this.http.get(url, this.auth.getESignOptions());
  }

  createCompany(orgUnitId: string, clientId: string, newCompanyJson: any) {
    return this.http.post(this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' +
      orgUnitId + '/clientid/' + clientId + '/clientcompany/create', newCompanyJson, this.auth.getESignOptions());
  }

  deleteCompany(orgUnitId: string, clientId: string, companyId: string) {
    return this.http.delete(this.auth.baseurl + '/iet/ClientCompanies/orgUnitId/' + orgUnitId +
    '/clientid/' + clientId + '/company/' + companyId + '/delete' ,  this.auth.getESignOptions());
  }



  getAccountTypes(companyTypeId: string) {
    console.log('calling getAccountTypes server api');
    const url: string = this.auth.baseurl + '/iet/Lookups/company/' + companyTypeId + '/accounttypes';
    return this.http.get(url, this.auth.getESignOptions());
  }

  getFiscalYearlist(orgUnitId: string, companyId: string) {
    console.log('calling getFiscalYearlist server api');
    const url: string = this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' +
    orgUnitId  + '/clientcompany/' + companyId + '/fiscalyears' ;
    return this.http.get(url, this.auth.getESignOptions());
  }

  getCompanyAccountLevelReceipts(orgUnitId: string, companyId: string, year: string) {
    console.log('calling getCompanyAccountLevelReceipts server api');
    const url: string = this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' +
    orgUnitId  + '/clientcompany/' + companyId + '/receipts/year/' + year;
    return this.http.get(url, this.auth.getESignOptions());
  }

  deleteReceiptImage (orgUnitId: string, companyId: string, docId: string) {
    console.log('calling deleteReceiptImage server api');
    const url: string = this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' +
    orgUnitId  + '/clientcompany/' + companyId + '/receipts/' + docId + '/delete';
    return this.http.delete(url, this.auth.getESignOptions());
  }

  getDataUrl(uploadedFile: File) {
    console.log('getDataUrl');
    const formData: FormData = new FormData();
    formData.append('ff', uploadedFile, uploadedFile.name);
    console.log(formData.getAll('ff'));
    return this.http.post(this.auth.baseurl + '/iet/ClientCompanies/dataurl', formData,
    this.auth.getESignOptionswithoutElToken());
  }

  downloadYearlyReceipts(orgUnitId: string, companyId: string, fiscalYear: string): any {
    const url: string = this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' + orgUnitId + '/clientcompany/' + companyId + '/year/' +
                        fiscalYear + '/mergedreceipts';
    console.log(url);
    this.getPDFBlob(url).subscribe(resp => {
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      console.log('set pdf:' + fileURL);
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = fileURL;
      link.download = fiscalYear + '_IncomeExpenseReceipts.pdf';
      link.click();
    });
  }

  updateCompany(orgUnitId: string, clientId: string, companyId: string, updateCompanyJson: any) {
    return this.http.post(this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' +
      orgUnitId + '/clientid/' + clientId + '/clientcompany/' + companyId + '/update', updateCompanyJson, this.auth.getESignOptions());
  }

  downloadReceipt(orgUnitId: string, companyId: string, docId: string): any {

    console.log('download Receipt..');
    const url: string = this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' +
                        orgUnitId + '/clientcompany/' + companyId + '/receipts/' +
                        docId + '/download';
    console.log(url);
    this.getPDFBlob(url).subscribe(resp => {
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      console.log('set pdf:' + fileURL);
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = fileURL;
      link.download = 'IncomeExpenseReceipt_' + docId + '.pdf';
      link.click();
    });
  }
  updateReceipt (orgUnitId: string, companyId: string, fiscalYear: string, accountType: string,
              newReceiptJson: any) {
    return this.http.post(this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' +
      orgUnitId + '/clientcompany/' + companyId + '/year/' + fiscalYear + '/account/' + accountType +
      '/receipts/update', newReceiptJson,
      this.auth.getESignOptions());
  }

  addNewReceipt (orgUnitId: string, clientId: string, companyId: string, newReceiptJson: any) {
    return this.http.post(this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' +
      orgUnitId + '/clientid/' + clientId + '/clientcompany/' + companyId + '/receipts/new', newReceiptJson,
      this.auth.getESignOptions());
  }

  addNewReceiptPDF(orgUnitId: string, clientId: string, companyId: string, amount: string,
    notes: string, uploadCustomerId: string,
    receiptDate: string, vendorName: string, accountTypeSeqNo: string, fileToUpload: File) {
    console.log('addNewReceiptPDF...')
    const formData: FormData = new FormData();
    formData.append('amount', amount);
    formData.append('notes', notes);
    formData.append('uploadCustomerId', uploadCustomerId);
    formData.append('receiptDate', receiptDate);
    formData.append('vendorName', vendorName);
    formData.append('accountTypeSeqNo', accountTypeSeqNo);
    formData.append('ff', fileToUpload, fileToUpload.name);
    console.log(formData.getAll('amount'));
    console.log(formData.getAll('notes'));
    console.log(formData.getAll('uploadCustomerId'));
    console.log(formData.getAll('receiptDate'));
    console.log(formData.getAll('vendorName'));
    console.log(formData.getAll('accountTypeSeqNo'));
    console.log(formData.getAll('ff'));
    return this.http.post(this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' +
    orgUnitId + '/clientid/' + clientId + '/clientcompany/' + companyId + '/receipts/pdf/new', formData,
    this.auth.getESignOptionswithoutElToken());
  }

  getVendors(orgUnitId: string, searchToken: string) {
    console.log('calling getVendors server api');
    const url: string = this.auth.baseurl + '/iet/ClientCompanies/orgunitid/' +  orgUnitId + '/vendor/' + searchToken
    return this.http.get(url, this.auth.getESignOptions());
  }
  // IET related server api - end

  getPdfFormMirrorImage(docId: string, seqNo: string) {
    console.log('calling getPdfFormMirrorImage api:' + docId + ',' + seqNo);
    const url: string = this.auth.baseurl + '/Contents/docid/' +  docId + '/pageSeqNo/' + seqNo + '/formmirrorimage'
    console.log(url);
    return this.http.get(url, this.auth.getESignOptions());
  }
  updateSignatureBoxCoordinates(docId: string, seqNo: string, eSignFields: any) {
    console.log('calling updateSignatureBoxCoordinates api:');
    const url: string = this.auth.baseurl + '/Contents/docid/' +  docId + '/pageSeqNo/' + seqNo + '/formboxcoordinates/update'
    return this.http.put(url, eSignFields, this.auth.getESignOptions());
  }
}

