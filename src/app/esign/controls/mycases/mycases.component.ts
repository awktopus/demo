import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { EsignserviceService } from '../../service/esignservice.service';
import { Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
@Component({
  selector: 'app-mycases',
  templateUrl: './mycases.component.html',
  styleUrls: ['./mycases.component.scss']
})
export class MycasesComponent implements OnInit, AfterViewInit {
  casefilter = 0;
  mycases: any;
  casedocs: any;
  selectedcase: any;
  caseinfo: any;
  primary: any = null;
  secondary: any = null;
  fprimary: any = null;
  fsecondary: any = null;
  fNoneSign: any = null;
  pdfUrl: string = null;
  docData: any = null;
  viewtype: any = null;
  // casesec
  form: any;
  signer: any;

  orgClientQuestions: any = null;
  cliIdQuestion1: any = null;
  cliIdAnswer1: any = null;
  cliIdQuestion2: any = null;
  cliIdAnswer2: any = null;
  cliIdQuestion3: any = null;
  cliIdAnswer3: any = null;
  message1: any = null;
  message2: any = null;
  message3: any = null;
  isValidAnswer1: any = 'N';
  isValidAnswer2: any = 'N';
  isValidAnswer3: any = 'N';
  secQuestionsCount: any;
  unsignforms: any;
  fprev: any;
  fnext: any;
  nonEsignfiles: File;
  isEsignForm: any;
  showspinner = false;
  // signing cap
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  public signaturePadOptions: any = {
    'minWidth': 1,
    'canvasWidth': 420,
    'canvasHeight': 220
  };
  public signatureImage: string;
  imageData: any;
  myDate: Date = new Date();
  type: string;
  selected: any = false;
  constructor(private service: EsignserviceService) { }
  ngOnInit() {
    this.service.getESignCases().subscribe(resp => {
      // console.log(resp);
      this.mycases = resp;
      console.log(this.mycases)
      this.mycases.forEach(cc => {
        cc.selected = false;
      })
      this.casedocs = null;
      this.selectedcase = null;
      this.caseinfo = null;
    });
    this.message1 = null;
    this.message2 = null;
    this.message3 = null;
    this.cliIdAnswer1 = null;
    this.cliIdAnswer2 = null;
    this.cliIdAnswer3 = null;
    this.cliIdQuestion1 = null;
    this.cliIdQuestion2 = null;
    this.cliIdQuestion3 = null;
    this.isValidAnswer1 = 'N';
    this.isValidAnswer2 = 'N';
    this.isValidAnswer3 = 'N';
  }

  selectcase(caseId: any) {
    this.mycases.forEach(cc => {
      if (cc.caseId === caseId) {
        cc.selected = true;
        this.selectedcase = cc;
      } else {
        cc.selected = false;
      }
    });
    this.loadCaseContent(caseId);
  }

  loadCaseContent(caseId) {
    this.casedocs = null;
    this.caseinfo = null;
    this.viewtype = '';
    this.message1 = null;
    this.message2 = null;
    this.message3 = null;
    this.service.getESignReviewPDF(caseId).subscribe(resp => {
      console.log(resp);
      this.casedocs = resp;
    });

    this.service.getSigningForm(caseId).subscribe(resp => {
      this.caseinfo = resp;
      console.log('Non esign case info:');
      console.log(this.caseinfo);
      this.prepareSigningData();
    });
  }

  private prepareSigningData() {
    this.primary = null;
    this.secondary = null;
    this.fprimary = null;
    this.fsecondary = null;
    this.fNoneSign = null;

    this.caseinfo.esignFormPages.forEach(page => {
      if (page.signers) {
        page.signers.forEach(sg => {
          if (sg.type === 'PRIMARY_SIGNER') {
            this.primary = sg;
          } else {
            this.secondary = sg;
          }
        });
      }
    });
    this.caseinfo.esignFormPages.forEach(page => {
      console.log('esign form page');
      console.log(page);
      if (page.approvedForEsign === 'Y') {
        this.isEsignForm = 'Y';
        if (page.signers) {
          page.signers.forEach(sg => {
            if (this.fprimary == null && sg.type === 'PRIMARY_SIGNER'
              && sg.esignStatus === 'ESign') {
              this.fprimary = page;
              console.log('primary');
              console.log(this.fprimary);
            }
            if (this.fsecondary == null && sg.type === 'SECONDARY_SIGNER'
              && sg.esignStatus === 'ESign') {
              this.fsecondary = page;
              console.log('secondary');
              console.log(this.secondary);
            }
          });
        }
      } else {
        console.log('non esign block');
        this.isEsignForm = 'N';
        if (page.signers) {
          page.signers.forEach(sg => {
            if (this.fNoneSign == null && sg.type === 'PRIMARY_SIGNER'
              && sg.esignStatus === 'ESign') {
              this.fNoneSign = page;
              console.log('non esign primary');
              console.log(this.fNoneSign);
            }
          });
        }
      }
    });
  }

  displayReviewDoc(ddata: any) {
    this.docData = ddata;
    console.log(this.docData);
    const url = this.service.auth.baseurl + '/Contents/' + this.docData.docId
    this.service.getPDFBlob(url).subscribe(resp => {
      console.log('got data back!!');
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.pdfUrl = fileURL;
      this.viewtype = 'reviewdoc';
    });
    this.casedocs.forEach(dd => {
      if (this.docData.docId === dd.docId) {
        dd.selected = true;
      } else {
        dd.selected = false;
      }
    });
    if (this.primary) {
      this.primary.selected = false;
    }
    if (this.secondary) {
      this.secondary.selected = false;
    }
  }


  downloadPaperForm() {
   console.log('Download paper form');
   console.log(this.selectedcase.caseId);
   this.service.downTaxPaperForms(this.selectedcase.caseId);
  }


  goCaseSec(signer: any, form, formType: any) {
    console.log('clicked sign card...go case sec' + formType);
    if (formType === 'esign') {
      this.isEsignForm = 'Y';
    } else {
      this.isEsignForm = 'N';
    }
    if (form == null) {
      return;
    }
    this.form = form;
    this.signer = signer;
    if (this.primary) {
      if (this.primary.clientId === signer.clientId) {
        this.primary.selected = true;
      } else {
      }
    }
    if (this.secondary) {
      if (this.secondary.clientId === signer.clientId) {
        this.secondary.selected = true;
      } else {
        this.secondary.selected = false;
      }
    }
    console.log(this.primary);
    console.log(signer);
    this.message1 = null;
    this.message2 = null;
    this.message3 = null;
    this.isValidAnswer1 = 'N';
    this.isValidAnswer2 = 'N';
    this.isValidAnswer3 = 'N';
    this.cliIdAnswer1 = null;
    this.cliIdAnswer2 = null;
    this.cliIdAnswer3 = null;
    this.cliIdQuestion1 = null;
    this.cliIdQuestion2 = null;
    this.cliIdQuestion3 = null;

    this.service.getSecurityQuestions(this.signer.clientId, this.selectedcase.caseId, this.signer.type)
      .subscribe(resp => {
        const obj = <any[]>resp;
        console.log('get security questions response');
        console.log(obj);
        this.orgClientQuestions = obj;
        this.secQuestionsCount = this.orgClientQuestions.length;
        console.log('org client id questions count:' + this.orgClientQuestions.length);
        for (let index = 0; index < this.orgClientQuestions.length; index++) {
          if (index === 0) {
            this.cliIdQuestion1 = this.orgClientQuestions[index];
          } else if (index === 1) {
            this.cliIdQuestion2 = this.orgClientQuestions[index];
          } else if (index === 2) {
            this.cliIdQuestion3 = this.orgClientQuestions[index];
          }
        }
        this.viewtype = 'seccheck';
      });
  }


  validateAnswer() {
    this.message1 = null;
    this.message2 = null;
    this.message3 = null;
    console.log('validate Answer - start');
    console.log(this.secQuestionsCount);
    let ansId: any;
    let ans2Id: any;
    let ans3Id: any;
    if (this.cliIdQuestion1) {
      ansId = this.cliIdQuestion1.ansId;
    }
    if (this.cliIdQuestion2) {
      ans2Id = this.cliIdQuestion2.ansId;
    }
    if (this.cliIdQuestion3) {
      ans3Id = this.cliIdQuestion3.ansId;
    }
    const data = {
      'clientId': this.signer.clientId,
      'answerId': ansId,
      'answer2Id': ans2Id,
      'answer3Id': ans3Id,
      'answer': this.cliIdAnswer1,
      'answer2': this.cliIdAnswer2,
      'answer3': this.cliIdAnswer3
    };
    console.log('client identity answer data:');
    console.log(data);
    this.service.validateSecAnswers(this.service.auth.getOrgUnitID(), this.cliIdQuestion1.clientId,
      this.selectedcase.caseId, data)
      .subscribe(resp => {
        const obj = <any>resp;
        console.log('validateSecAnswers');
        console.log(obj);
        let counter: any;
        if (obj) {
          counter = 0;
          obj.forEach(element => {
            counter += 1;
            if (this.cliIdQuestion1 && counter === 1) {
              if (element.ansId === this.cliIdQuestion1.ansId && element.isValidAnswer === 'Y') {
                this.isValidAnswer1 = 'Y';
                console.log('validated answer1');
                if (this.secQuestionsCount === 1) {
                  console.log('all the questions are answered..');
                  this.viewtype = 'consentview';
                }
              } else {
                this.isValidAnswer1 = 'N';
                this.message1 = 'Invalid Answer';
              }
            }
            if (this.cliIdQuestion2 && counter === 2) {
              if (element.ansId === this.cliIdQuestion2.ansId && element.isValidAnswer === 'Y') {
                this.isValidAnswer2 = 'Y';
                console.log('validated answer2');
                if (this.isValidAnswer1 === 'Y' && this.secQuestionsCount === 2) {
                  console.log('all the questions are answered..');
                  this.viewtype = 'consentview';
                }
              } else {
                this.isValidAnswer2 = 'N';
                this.message2 = 'Invalid Answer';
              }
            }
            if (this.cliIdQuestion3 && counter === 3) {
              if (element.ansId === this.cliIdQuestion3.ansId && element.isValidAnswer === 'Y') {
                this.isValidAnswer3 = 'Y';
                console.log('validated answer3');
                if (this.isValidAnswer1 === 'Y' && this.isValidAnswer2 === 'Y' && this.secQuestionsCount === 3) {
                  console.log('all the questions are answered..');
                  this.viewtype = 'consentview';
                }
              } else {
                this.isValidAnswer3 = 'N';
                this.message3 = 'Invalid Answer';
              }
            }
          });
        }
      });
  }

  completeConsent(firstName: string, lastName: string) {
    console.log('inside display consent view:' + firstName + ' ' + lastName);
    const activityLog = {
      typeofActivity: 'eSign consent',
      auditInfo: 'Client read and agreed the consent',
      updatedBy: firstName
    }
    this.service.updateCaseActivityLog(this.selectedcase.caseId, activityLog).subscribe(respAL => {
      const obj = <any>respAL;
      if (obj.statusCode === '200') {
        this.selected = false;
        console.log('valid consent and now display signing view');
        this.viewtype = 'signingview';
        this.displaySigningView(this.form, this.signer);
        const fm: any = this.form;
        const signer: any = this.signer;
        const returnvalue: any = '';
        console.log(fm);
        this.form = fm;
        this.signer = signer;
        const docID: any = this.form.docId;
        const pageSeq: any = this.form.seqNo;
        const mergeFlag: any = this.form.contentMergeFlag;
        const vt: any = 'signingview';
        const seq: number = pageSeq;
        let url = this.service.auth.baseurl + '/Contents/' + docID + '/' + seq;
        if (mergeFlag === 'Y') {
          url = url + '/mergedform';
        }
        this.service.getPDFBlob(url).subscribe(resp1 => {
          console.log('got data back!!');
          console.log(resp1);
          const file = new Blob([<any>resp1], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          console.log('before assigning to pdfUrl');
          this.pdfUrl = fileURL;
          this.viewtype = vt;
        });
        this.service.getUnsignedForm(this.signer.clientId, this.selectedcase.caseId).subscribe(resp => {
          this.unsignforms = <any>resp;
          this.fprev = null;
          this.fnext = null;
          this.prepareSignerData();
        });
      }
    });
  }

  displaySigningView(fm: any, signer: any) {
    console.log(fm);
    this.form = fm;
    this.signer = signer;
    this.displayDoc(this.form.docId, this.form.seqNo, this.form.contentMergeFlag, 'signingview')
    console.log('display doc done calling get Unsigned form')
    // now query and calculated the pre/next button
    this.service.getUnsignedForm(this.signer.clientId, this.selectedcase.caseId).subscribe(resp => {
      this.unsignforms = <any>resp;
      this.fprev = null;
      this.fnext = null;
      this.prepareSignerData();
    });
  }

  displayDoc(docID: string, pageSeq: number, mergeFlag: string, vt: string) {
    console.log('inside display Doc:' + vt);
    const seq: number = pageSeq;
    let url = this.service.auth.baseurl + '/Contents/' + docID + '/' + seq;
    if (mergeFlag === 'Y') {
      url = url + '/mergedform';
    }
    console.log('display Doc:' + url);
    this.service.getPDFBlob(url).subscribe(resp => {
      console.log('got data back!!');
      console.log(resp);
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.pdfUrl = fileURL;
      this.viewtype = vt;
    });
  }

  filterSigningform() {
    const tmpary = [];
    this.unsignforms.esignFormPages.forEach(frm => {
      if (frm.signers[0].type === this.signer.type) {
        tmpary.push(frm);
      }
    });
    console.log(tmpary);
    this.unsignforms.esignFormPages = tmpary;
  }
  prepareSignerData() {
    this.filterSigningform();
    if (this.unsignforms && this.unsignforms.esignFormPages.length > 0) {
      let ii = -1;
      for (let index = 0; index < this.unsignforms.esignFormPages.length; index++) {
        const frm = this.unsignforms.esignFormPages[index];
        if (frm.docId === this.form.docId && frm.seqNo === this.form.seqNo) {
          ii = index;
          break;
        }
      }
      //  console.log(ii);
      if (ii <= 0) {
        this.fprev = null;
        this.fnext = this.unsignforms.esignFormPages[ii + 1];
      } else if (ii === this.unsignforms.esignFormPages.length - 1) {
        this.fprev = this.unsignforms.esignFormPages[ii - 1];
      } else {
        this.fnext = this.unsignforms.esignFormPages[ii + 1];
        this.fprev = this.unsignforms.esignFormPages[ii - 1];
      }
    }
  }

  switchOffPDFCard() {
    this.casedocs.forEach(doc => {
      doc.selected = false;
    });
  }
  goSigCap(form: any, signer: any) {
    this.viewtype = 'sigcap';
  }

  savedrawing() {
    this.signatureImage = this.signaturePad.toDataURL();
    this.service.saveSignature(this.signer.clientId, this.form.caseId, this.signatureImage)
      .subscribe(resp => {
        console.log(resp);
      });
  }

  loadDrawing() {
    this.service.loadSignature(this.form.caseId, this.signer.clientId).subscribe(resp => {
      const data: any = resp;
      this.signatureImage = data.dataUrl;
      this.signaturePad.set('minWidth', 1);
      this.signaturePad.clear();
      this.signaturePad.fromDataURL(this.signatureImage);
    });
    // this.signaturePad.fromData(this.imageData);
  }

  drawClear() {
    this.signaturePad.clear();
  }

  canvasResize() {
    const canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  ngAfterViewInit() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  submitCap() {
    this.showspinner = true;
    console.log(this.myDate);
    console.log(this.form);
    const data = {
      'clientId': this.signer.clientId,
      'caseId': this.selectedcase.caseId,
      'docId': this.form.docId,
      'seqNo': this.form.seqNo,
      'formId': this.form.formId,
      'templateId': this.form.templateId,
      'dateSigned': this.myDate,
      'securedPin': '1111',
      'contentMergeFlag': 'Y',
      'type': this.signer.type,
      'mergeSeqNo': this.form.mergeSeqNo,
      'dataUrl': this.signaturePad.toDataURL()
    };
    console.log('form submit data:');
    console.log(data);
    this.service.submitSignatureForm(data).subscribe(resp => {
      console.log(resp);
      // the return object has the esign pages
      // will automatically goto the next unsigned page
      const pages = (<any>resp).trueEsignFormPages;
      if (pages != null && pages.length > 0) {
        // will route to the next esign page
        // this.navCtrl.setRoot(SigningviewPage,{caseId: this.caseID,form: pages[0],signer:this.signer});
        this.displaySigningView(pages[0], this.signer);
        // this.loadCaseContent(this.selectedcase.caseId);
      } else {
        // will route to the caseesign page
        // this.navCtrl.setRoot(CaseesignsPage,{caseId:this.caseID});
        this.viewtype = ' ';
        this.form = null;
        this.signer = null;
        // need to refresh the case pages
        this.loadCaseContent(this.selectedcase.caseId);
      }
      this.showspinner = false;
    });
  }

  goEsignFormView(form?: any) {
    if (!form) {
      form = this.caseinfo.esignFormPages[0];
    }
    this.viewtype = '';
    this.form = null;
    //  this.primary = null;
    //  this.secondary = null;
    this.fprev = null;
    this.fnext = null;
    this.service.getClientInfo(form.docId, form.seqNo).subscribe(resp => {
      console.log(resp);
      this.form = resp;
      // now process signature
      if (this.form.esigners) {
        this.form.esigners.forEach(element => {
          if (element.type === 'PRIMARY_SIGNER') {
            this.primary = element;
          } else {
            this.secondary = element;
          }
        });
      }
      this.displayDoc(this.form.docId, this.form.seqNo, this.form.contentMergeFlag, 'esignformview');
    });
    this.service.getEsignReviewForms(this.selectedcase.caseId).subscribe(resp => {
      this.caseinfo = resp;
      console.log(this.caseinfo);
      let ii = -1;
      for (let index = 0; index < this.caseinfo.esignFormPages.length; index++) {
        const frm = this.caseinfo.esignFormPages[index];
        if (frm.docId === this.form.docId && frm.seqNo === this.form.seqNo) {
          ii = index;
          break;
        }
      }
      if (ii <= 0) {
        this.fprev = null;
        this.fnext = this.caseinfo.esignFormPages[ii + 1];
      } else if (ii === this.caseinfo.esignFormPages.length - 1) {
        this.fprev = this.caseinfo.esignFormPages[ii - 1];
      } else {
        this.fnext = this.caseinfo.esignFormPages[ii + 1];
        this.fprev = this.caseinfo.esignFormPages[ii - 1];
      }
    });
  }

  tStatus(desc): string {
    if (desc === 'ESign') {
      return 'To be signed';
    } else {
      return desc;
    }
  }

  uploadNonEsignForm(form: any, signer: any, type: string, ff: File | FileList) {
    console.log(form);
    this.form = form;
    this.service.uploadNonEsignForm(signer.clientId, this.caseinfo.caseId, this.form.docId, this.form.seqNo, type, ff).subscribe(resp => {
      console.log('upload non esign forms response');
      console.log(resp);
      // the return object has the esign pages
      // will automatically goto the next unsigned page
      const pages = (<any>resp).nonesignFormPages;
      if (pages != null && pages.length > 0) {
        // will route to the next esign page
        // this.navCtrl.setRoot(SigningviewPage,{caseId: this.caseID,form: pages[0],signer:this.signer});
        this.displaySigningView(pages[0], signer);
        // this.loadCaseContent(this.selectedcase.caseId);
      } else {
        this.loadCaseContent(this.selectedcase.caseId);
      }
    },
      error => console.log(error)
    );
  }


}
