import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import {EzsigndataService } from '../../service/ezsigndata.service';
import { Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { MatDialog } from '@angular/material';
import { DialogMissingDataMessageDialogComponent,DialogNoFormMessageDialogComponent} from '../docSigning/docSigning.component'
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-myezsigndocs',
  templateUrl: './myezsigndocs.component.html',
  styleUrls: ['./myezsigndocs.component.scss']
})
export class MyEzsignDocsComponent implements OnInit, AfterViewInit {

  @ViewChildren(SignaturePad) public sigPadList: QueryList< SignaturePad>;
  public signaturePadOptions: any = {
    'minWidth': 1,
    'canvasHeight': 220,
    'backgroundColor': '#ffffff'
  };

  myDate: Date = new Date();
  type: string;
  selected: any = false;
  selectedPaperConsent: any = false;
  mycases: any = [];
  casefilter = 0;
  selectedcase: any = {};
  curcase: any = {};
  curseq = 0;
  cursigner: any = {};
  curDocID: any;
  curMergeFlag: any;
  fprev: any = null;
  fnext: any = null;
  curpage: any = null;
  viewType: any = "";
  pdfUrl:  any;
  fieldsCount = 0;
  signedCount = 0;
  agreementselected = false;
  signcapform: FormGroup = new FormGroup({});
  myinput: any = {};
  mysigs: any = {};
  showProcessSpinner = false;
  constructor(private service: EzsigndataService,
    public dialog: MatDialog,private router:Router) {

  }
  ngAfterViewInit(): void {
   // throw new Error("Method not implemented.");
  }
  ngOnInit() {
    this.service.getEZSignDocs().subscribe(resp => {
      console.log(resp);
      this.mycases = resp;
      this.prepareData();
      console.log(this.mycases);
    });
  }

  reloadCaseData() {
    this.service.getEZSignDocs().subscribe(resp => {
      console.log(resp);
      this.mycases = resp;
      this.prepareData();
      console.log(this.mycases);
    });
  }
  selectcase(docId: any) {
    this.mycases.forEach(cc => {
      if (cc.docId === docId) {
        cc.selected = true;
        this.selectedcase = cc;
      } else {
        cc.selected = false;
      }
    });
    // this.loadCaseContent(docId);
  }


  tStatus(desc): string {
    if (desc === 'Sent to recipient') {
      return 'To be signed';
    } else {
      return desc;
    }
  }

  prepareData() {

    if (this.mycases) {
    const userID = this.service.auth.getUserID();
    this.mycases.forEach(cc => {
      // not calculation display names
      if (cc.documentName.length < 40) {
        cc.displayName = cc.documentName;
      } else {
        cc.displayName = cc.documentName.substring(0, 20) + "..." + cc.documentName.substring(cc.documentName.length - 15);
      }

      // count fields and numbers
      cc.completedFields = 0;
      cc.readyFields = 0;
      cc.eZSignDocPages.forEach(pp => {
        if (pp.pageFields) {
          pp.pageFields.forEach(ff => {
            if (ff.receiverId === userID) {
              cc.readyFields = cc.readyFields + 1;
              if (ff.status === "Signed") {
                cc.completedFields = cc.completedFields + 1;
              }
            }
          });
        }
      });
    });
  }
  }
  displayReviewDoc(cc: any){
    console.log(cc);
    this.service.setCacheData("case",cc);
    this.router.navigate(['main/ezsign/docreview']);
  }
  displayReviewDoc_old(cc: any) {
    this.viewType = "reviewDoc";
    let firstseq = cc.eZSignDocPages[0].pageSeqNo;
    let signer: any = null;
    cc.ezSignDocSigners.forEach(ss => {
        if (ss.receiverId === this.service.auth.getUserID()) {
          signer = ss;
        }
    });
    // now display the document
    // this.paramRouter.navigate('/tools/ezsign/ezsignformview', {case: cc,pageSeq:firstseq,signer:signer});
    this.curcase = cc;
    this.cursigner = signer;
    this.curseq = firstseq;
    this.prepareReviewData();
  }


  prepareReviewData() {
    let unsignedforms = [];
    if (this.curcase) {
      this.curDocID = this.curcase.docId;
      let index = 0;
      this.fprev = null;
      this.fnext = null;
      this.curcase.eZSignDocPages.forEach(page => {
        if (page.pageSeqNo === this.curseq) {
          this.curMergeFlag = page.contentMergeFlag;
          if (index > 0) {
            this.fprev = this.curcase.eZSignDocPages[index - 1];
          }
          if (index < this.curcase.eZSignDocPages.length - 1) {
            this.fnext = this.curcase.eZSignDocPages[index + 1];
          }
          this.curpage = page;
        }
        index = index + 1;
      });
      this.fieldsCount = 0;
      // tslint:disable-next-line: whitespace
      this.signedCount=0;
      if (this.curpage.pageFields) {
        // tslint:disable-next-line: whitespace
        this.curpage.pageFields.forEach(fd=> {
          console.log(this.curcase);
          if (fd.receiverId === this.cursigner.receiverId) {
            this.fieldsCount = this.fieldsCount + 1;
            if (fd.status === 'Signed') {
              this.signedCount = this.signedCount + 1;
            }
          }
        });
      }
      console.log(this.signedCount);
      console.log(this.fieldsCount);
    }
    this.displayPDFDocPage(this.curDocID, this.curseq, this.curMergeFlag);
  }

  goReviewForm(page: any) {
    this.curseq = page.pageSeqNo;
    this.prepareReviewData();
  }

  displayPDFDocPage(docId, seq, mergeFlag) {
    let url = this.service.auth.baseurl + '/EZSign/document/' + docId + "/page/" + seq;
    console.log(url);
    if (mergeFlag === 'Y') {
      url = url + '/mergedform';
    }

    this.service.getPDFBlob(url).subscribe(resp => {
      console.log('got data back!!');
      const file = new Blob([<any>resp], {type: 'application/pdf'});
      const fileURL = URL.createObjectURL(file);
      this.pdfUrl = fileURL;
    });
    /*
    this.service.getPDFBlob(url).subscribe(resp => {
      console.log('got data back!!');
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.pdfUrl = fileURL;
      this.viewtype = 'reviewdoc';
    });
    */
  }

  goAgreementView(cc: any ){
    console.log(cc);
    this.service.setCacheData("case",cc);
    this.router.navigate(['main/ezsign/docsigning']);
  }
   goAgreementView_old (cc: any ) {
    this.viewType = "";
    let signer: any = null;
    this.agreementselected = false;
    cc.ezSignDocSigners.forEach( ss => {
        if (ss.receiverId === this.service.auth.getUserID()) {
          signer = ss;
        }
    });
    let firstseq = this.findSignPageSeq(cc, signer);
    console.log(firstseq);
    if (firstseq > -1) {
      this.curcase = cc;
      this.curseq = firstseq;
      this.cursigner = signer;
      this.viewType = "consentview"; // turn on agreement view
    } else {
      const alert = this.dialog.open(DialogNoFormMessageDialogComponent);
    }
  }

  findSignPageSeq(cc, signer) {
      let pseq = -1;
      cc.eZSignDocPages.forEach(page => {
        console.log(page.pageSeqNo);
        let pfcount = 0;
        if ( page.status !== "Signed") {
          if (page.pageFields) {
            page.pageFields.forEach(fd => {
              if ((fd.receiverId === signer.receiverId) && (fd.status !== 'Signed')) {
                if (pseq === -1) {
                  pseq = page.pageSeqNo;
                }
              }
            });
          }
        }
      });
      return pseq;
  }

  completeConsent() {
    console.log(this.curseq);
    this.service.postEzsignAgreementAudit(this.curcase.docId, this.curseq).subscribe(resp => {
      if (resp) {
        console.log(resp);
        this.cursigner.isAgreementAccepted = (<any>resp).isAgreementAccepted;
       // this.paramRouter.navigate('/tools/ezsign/ezsignsigningview', {case: this.case,pageSeq:this.pageSeq,signer:this.signer});
       this.prepareReviewData();
       this.viewType = "signingFormView";
      }
    });

  }

 filterSignerFields() {
    let filtered_fields = [];
    this.curpage.pageFields.forEach(fd => {
      if (fd.receiverId === this.cursigner.receiverId) {
        filtered_fields.push(fd);
      }
    });
    console.log("original field size:", this.curpage.pageFields.length);
    console.log("filtered field size:", filtered_fields.length);
    this.curpage.filterFields = filtered_fields;
}
goSignCap() {
  this.viewType = "signcapview";
  this.signcapform = new FormGroup({});
  this.filterSignerFields();
  this.curpage.filterFields.forEach(field => {
    this.signcapform.addControl(field.labelName, new FormControl('', Validators.required));
  });

  // iinitialized signaturepad
  this.initSigCap();
  console.log(this.curpage.filterFields);
  console.log(this.cursigner);
 }

 initSigCap() {
   this.myinput = {};
   this.mysigs = {};
  this.curpage.pageFields.forEach( fd => {
    this.myinput[fd.labelName] = "";
  });
  console.log(this.mysigs);
  console.log(this.myinput);
}

 clearSigCap(field) {
  console.log(this.sigPadList.toArray());
  let id = field.labelName;
  console.log(id);
  let index = 0;
  let res = this.sigPadList.toArray();
  this.curpage.filterFields.forEach(fd => {
    if (fd.labelName === id) {
      console.log(fd.labelName, "  ", id , index);
      res[index].clear();
    }
    if (fd.fieldTypeName === 'Signature') {index = index + 1; }
  });
  }

  getInput() {
    let fields = this.curpage.filterFields;
    let allfilled = true;
    // console.log(fields);
    let sigindex = 0;
    let res = this.sigPadList.toArray();
    this.curpage.filterFields.forEach( fd => {
      if (fd.fieldTypeName === 'Signature') {
        this.mysigs[fd.labelName] = res[sigindex];
        sigindex = sigindex + 1;
      }
    });
    this.myinput = this.signcapform.value;
    fields.forEach(fd => {
      const lbl = fd.labelName;
      if (fd.fieldTypeName === 'Signature') {
        if (this.mysigs[lbl].isEmpty()) {
            this.myinput[lbl] = "";
          allfilled = false;
        } else {
          this.myinput[lbl] = this.mysigs[lbl].toDataURL();
        }
      } else {
        if (this.myinput[lbl] == null || this.myinput[lbl] === "") {
          allfilled = false;
        }
      }
    });
    // console.log(this.myinput);
    return allfilled;
  }

  submitSignCapData() {
    this.showProcessSpinner = true;
    if (this.getInput()) {
      console.log(this.myinput);

      let json = this.buildJson();
      this.service.postSubmitSignCap(json).subscribe(async res => {
          this.curcase = res;
          console.log(this.curcase);
          // we also need to update the case list
          this.reloadCaseData();
          let nextseq = this.findSignPageSeq(this.curcase, this.cursigner);
          console.log("the next page seq:", nextseq);
          console.log(nextseq);
          if (nextseq > -1) {
             // this.paramRouter.navigate('/tools/ezsign/ezsignsigningview', {case: this.mycase,pageSeq:nextseq,signer:this.signer});
             this.curseq = nextseq;
             this.prepareReviewData();
             this.viewType = "signingFormView";
          } else {
              // all signing done for this form
              this.viewType = "";
              this.curseq = -1;
              this.curpage = null;
              this.curcase = null;
          }
          this.showProcessSpinner = false;
      });
    } else {
      this.showProcessSpinner = false;
      console.log("Missing data");
      this.dialog.open(DialogMissingDataMessageDialogComponent);
    }
  }

  buildJson() {
    // build fields
    console.log(this.signcapform);
    var fddata = [];
    this.curpage.filterFields.forEach( fd => {
        if (fd.fieldTypeName === 'Signature') {
          fd.signatureDataUrl = this.myinput[fd.labelName];
        } else {
          fd.fieldValue = this.myinput[fd.labelName];
        }
        fddata.push(fd);
    });
    let json = {
      ezSignTrackingId: this.curcase.ezSignTrackingId,
      status: "",
      docId: this.curcase.docId,
      eZSignDocPage: {
        pageSeqNo: this.curpage.pageSeqNo,
        status: "",
        contentMergeFlag: "",
        pageFields: fddata
      }
    };
    return json;
  }

}
/*
@Component({
  selector: 'dialog-noform_message-dialog',
  templateUrl: 'dialog-noform_message-dialog.html',
})
export class DialogNoFormMessageDialogComponent {}
@Component({
  selector: 'dialog-missingdata-message-dialog',
  templateUrl: 'dialog-missingdata-message-dialog.html',
})
export class DialogMissingDataMessageDialogComponent {}
*/