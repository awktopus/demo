import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import {EzsigndataService } from '../../service/ezsigndata.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { MatDialog } from '@angular/material';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-doc-review',
  templateUrl: './docReview.component.html',
  styleUrls: ['./docReview.component.scss']
})
export class DocReviewComponent implements OnInit, AfterViewInit {

  myDate: Date = new Date();
  type: string;
  selected: any = false;
  selectedPaperConsent: any = false;
  mycase:any={};
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
    public dialog: MatDialog) {
      // here we get the case data
    
  }
  ngAfterViewInit(): void {
   // throw new Error("Method not implemented.");
  }
  ngOnInit() {
    this.mycase=this.service.getCacheData("case");
    console.log(this.mycase);
    this.prepareData();
    this.displayReviewDoc();
  }

  tStatus(desc): string {
    if (desc === 'Sent to recipient') {
      return 'To be signed';
    } else {
      return desc;
    }
  }

  prepareData() {

    if (this.mycase) {
    const userID = this.service.auth.getUserID();
    let cc = this.mycase;
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
  
   }
  }

  displayReviewDoc() {
    console.log("inside display doc");
    let cc = this.mycase;
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
  }