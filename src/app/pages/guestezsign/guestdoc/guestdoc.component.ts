import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GuestEzsignService } from '../service/guestezsign.service';
import { Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { MatDialog } from '@angular/material';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { PdfViewerModule, PdfViewerComponent } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-guesetezsigndoc',
  templateUrl: './guestdoc.component.html',
  styleUrls: ['./guestdoc.component.scss']
})
export class EzsignGuestDocComponent implements OnInit {
  @ViewChildren(SignaturePad) public sigPadList: QueryList<SignaturePad>;
  @ViewChild(PdfViewerComponent) private sigpdfview: PdfViewerComponent;
  @ViewChild('pdfviewcontainer') ele_pdfview: ElementRef;
  public signaturePadOptions: any = {
    'minWidth': 2,
    'canvasHeight': 160,
    'backgroundColor': '#ffffff'
  };

  myDate: Date = new Date();
  type: string;
  selected: any = false;
  selectedPaperConsent: any = false;
  mycase: any;
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
  pdfUrl: any;
  fieldsCount = 0;
  signedCount = 0;
  agreementselected = false;
  signcapform: FormGroup = new FormGroup({});
  myinput: any = {};
  mysigs: any = {};
  showProcessSpinner = false;
  pageToSign = 0;
  size_container: any = {};
  size_pdf: any = {};
  cur_signed_pages = [];
  showReviewSpinner = false;
  showSubmitSpinner = false;
  constructor(private service: GuestEzsignService,
    public dialog: MatDialog, private router: Router) {

  }

  ngOnInit() {
    console.log('guest ezsign document ngOnInit');
    this.service.getGuestEzsignDoc().subscribe(resp => {
      console.log(resp);
      this.mycase = resp;
      // this.mycase = this.service.getCacheData("case");
      this.service.setCacheData("case", this.mycase);
      this.curcase = this.mycase;
      this.prepareData();
      // by default will should the consent page
      if (this.curcase && this.curcase.status !== 'Signed') {
        this.initPagesView();
        this.pageToSign = this.countTotalUnsignedPages();
        this.viewType = "consentview";
      }
    });
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
      const userID = this.service.auth.getSignerClientID();
      let cc = this.mycase;
      if (cc.documentName.length < 40) {
        cc.displayName = cc.documentName;
      } else {
        cc.displayName = cc.documentName.substring(0, 20) + "..." + cc.documentName.substring(cc.documentName.length - 15);
      }

      // count fields and numbers
      cc.completedFields = 0;
      cc.readyFields = 0;
      if (cc.eZSignDocPages) {
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
  }

  displayReviewDoc(cc: any) {
    console.log(cc);
    this.service.setCacheData("case", cc);
    this.router.navigate(['main/ezsign/docreview']);
  }

  SkipPage() {
    this.cur_signed_pages.push(this.curseq);
    let nextseq = this.findSignPageSeq(this.curcase, this.cursigner);
    console.log("the next page seq:", nextseq);
    console.log(nextseq);
    if (nextseq > 0) {
      // this.paramRouter.navigate('/tools/ezsign/ezsignsigningview', {case: this.mycase,pageSeq:nextseq,signer:this.signer});
      this.curseq = nextseq;
      this.prepareReviewData();
      this.countTotalUnsignedPages();
      this.goSignCap();
    } else {
      // all signing done for this form
      this.viewType = "";
      this.curseq = -1;
      console.log("need navigate back to the main page");
      this.preSignComplete();
    }
    this.showProcessSpinner = false;
  }

  initPagesView() {
    let cc = this.mycase;
    let signer: any = null;
    if (cc.ezSignDocSigners) {
    cc.ezSignDocSigners.forEach(ss => {
      if (ss.receiverId === this.service.auth.getSignerClientID()) {
        signer = ss;
      }
    });
  }
    let firstseq = this.findSignPageSeq(cc, signer);
    if (firstseq < 0) {
      firstseq = 0;
    }
    // now display the document
    // this.paramRouter.navigate('/tools/ezsign/ezsignformview', {case: cc,pageSeq:firstseq,signer:signer});
    this.curcase = cc;
    this.cursigner = signer;
    this.curseq = firstseq;
    this.prepareReviewData();
  }


  prepareReviewData() {
    let unsignedforms = [];
    console.log(this.curcase);
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
      this.signedCount = 0;
      console.log('curpage');
      console.log(this.curpage);
      if (this.curpage && this.curpage.pageFields) {
        // tslint:disable-next-line: whitespace
        this.curpage.pageFields.forEach(fd => {
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
    let url = this.service.auth.baseurl + '/guestezsign/document/' + docId + "/page/" + seq;
    console.log(url);
    if (mergeFlag === 'Y') {
      url = url + '/mergedform';
    }

    this.service.getPDFBlob(url).subscribe(resp => {
      console.log('got data back!!');
      const file = new Blob([<any>resp], { type: 'application/pdf' });
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

  goAgreementView(cc: any) {
    this.viewType = "";
    let signer: any = null;
    this.agreementselected = false;
    cc.ezSignDocSigners.forEach(ss => {
      if (ss.receiverId === this.service.auth.getSignerClientID()) {
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

  countTotalUnsignedPages() {
    let count = 0;
    let cc = this.curcase;
    let signer = this.cursigner;
    cc.eZSignDocPages.forEach(page => {
      console.log(page.pageSeqNo);
      if (page.status !== "Signed") {
        if (page.pageFields) {
          let found = false;
          page.pageFields.forEach(fd => {
            if ((fd.receiverId === signer.receiverId) && (fd.status !== 'Signed')) {
              found = true;
            }
          });
          if (found) {
            count = count + 1;
          }
        }
      }
    });
    return count;
  }

  findSignPageSeq(cc, signer) {
    let pseq = -1;
    cc.eZSignDocPages.forEach(page => {
      console.log(page.pageSeqNo);
      let alreadysigned = this.cur_signed_pages.includes(page.pageSeqNo);
      if (page.status !== "Signed" && (!alreadysigned)) {
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
        this.goSignCap();
      }
    });
    // here we are reset the signing seq
    this.cur_signed_pages = [];
  }

  filterSignerFields() {
    let filtered_fields = [];
    let presubmit = false;
    this.curpage.pageFields.forEach(fd => {
      if (fd.receiverId === this.cursigner.receiverId) {
        filtered_fields.push(fd);
      }
    });

    console.log("original field size:", this.curpage.pageFields.length);
    console.log("filtered field size:", filtered_fields.length);
    this.curpage.filterFields = filtered_fields;
    this.curpage.filterFields.forEach(ffd => {
      if (ffd.status === "Presigned" && (!this.curpage.presignstatus)) {
        this.curpage.presignstatus = true;
      }
    });
    console.log(this.curcase);
    console.log(this.curpage);
  }

  viewPreSignPage() {
    var trackId = this.curcase.ezSignTrackingId;
    var docId = this.curcase.docId;
    var pageseq = this.curpage.pageSeqNo;
    this.service.showEzsignPagePreview(trackId, docId, pageseq);
  }
  pageRendered(eve) {
    console.log("rendering pdf ...");
    console.log(eve);
    this.size_pdf = {
      width: eve.source.div.clientWidth, height: eve.source.div.clientHeight, scale:
        eve.source.viewport.scale
    };
    console.log(this.size_pdf);
    this.size_container = { width: this.ele_pdfview.nativeElement.clientWidth, height: this.ele_pdfview.nativeElement.clientHeight };
    console.log(this.size_container);
    this.curpage.filterFields.forEach(ff => {
      ff.adjustPosX = ff.posX * this.size_pdf.scale + (this.size_container.width - this.size_pdf.width) / 2;
      ff.adjustposY = ff.posY * this.size_pdf.scale;
    });
  }

  pickField(event) {
    console.log(event);
    let fldseq = event.source.value;
    this.curpage.filterFields.forEach(ff => {
      if (fldseq === ff.fieldSeqNo) {
        ff.picked = event.checked;
        if (ff.picked === true) {
          ff.bgcolor = "#eeffee";
        } else {
          ff.bgcolor = "";
        }
      } else {
        ff.picked = false;
        ff.bgcolor = "";
      }
    });

  }

  goSignCap() {

    this.signcapform = new FormGroup({});
    this.filterSignerFields();
    let str_today = new Date().toISOString().split('T')[0];
    let values = {};
    this.curpage.filterFields.forEach(field => {
      field.eleId = "ele_" + field.fieldSeqNo;
      this.signcapform.addControl(field.eleId, new FormControl('', Validators.required));
      if (field.fieldTypeName === "Date") {
        values[field.eleId] = str_today;
        console.log("set default date");
      } else {
        values[field.eleId] = "";
      }
      if (field.fieldValue !== null && field.fieldValue !== "") {
        console.log("set value from store value");
        values[field.eleId] = field.fieldValue;
      }
    });
    console.log("form values:--->");
    console.log(values);
    this.signcapform.setValue(values);
    // iinitialized signaturepad
    console.log(this.curpage.filterFields);
    console.log(this.cursigner);
    console.log(this.signcapform);
    this.viewType = "signcapview";
    this.initSigCap();
  }

  initSigCap() {
    this.myinput = {};
    this.mysigs = {};
    let index = 0;
    this.curpage.pageFields.forEach(fd => {
      this.myinput[fd.eleId] = "";
      if (fd.fieldTypeName === "Signature") {
        if (fd.fieldValue !== "") {
          //   res[index].fromDataURL(fd.fieldValue);
        }
        index = index + 1;
      }

    });

    console.log(this.mysigs);
    console.log(this.myinput);
    setTimeout(() => {
      this.loadPreSignature();
    }, 100);
  }

  loadPreSignature() {
    let res = this.sigPadList.toArray();
    let index = 0;
    this.curpage.pageFields.forEach(fd => {
      this.myinput[fd.eleId] = "";
      if (fd.fieldTypeName === "Signature") {
        if (fd.fieldValue !== "") {
          res[index].fromDataURL(fd.fieldValue);
        }
        index = index + 1;
      }
    });
  }

  clearSigCap(field) {
    console.log(this.sigPadList.toArray());
    let id = field.eleId;
    console.log(id);
    let index = 0;
    let res = this.sigPadList.toArray();
    this.curpage.filterFields.forEach(fd => {
      if (fd.eleId === id) {
        console.log(fd.eleId, "  ", id, index);
        res[index].clear();
      }
      if (fd.fieldTypeName === 'Signature') { index = index + 1; }
    });
  }

  getInput() {
    let fields = this.curpage.filterFields;
    let allfilled = true;
    // console.log(fields);
    let sigindex = 0;
    let res = this.sigPadList.toArray();
    this.curpage.filterFields.forEach(fd => {
      if (fd.fieldTypeName === 'Signature') {
        this.mysigs[fd.eleId] = res[sigindex];
        sigindex = sigindex + 1;
      }
    });
    this.myinput = this.signcapform.value;
    fields.forEach(fd => {
      const lbl = fd.eleId;
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
      this.service.postPreSubmitEzsignPage(json).subscribe(async res => {
        this.curcase = res;
        console.log(this.curcase);
        // we also need to update the case list
        //  this.reloadCaseData();
        this.cur_signed_pages.push(this.curseq);
        let nextseq = this.findSignPageSeq(this.curcase, this.cursigner);
        console.log("the next page seq:", nextseq);
        console.log(nextseq);
        if (nextseq > -1) {
          // this.paramRouter.navigate('/tools/ezsign/ezsignsigningview', {case: this.mycase,pageSeq:nextseq,signer:this.signer});
          this.curseq = nextseq;
          this.prepareReviewData();
          this.countTotalUnsignedPages();
          this.goSignCap();
        } else {
          // all signing done for this form
          this.viewType = "";
          this.curseq = -1;
          this.preSignComplete();
          // this.dialog.open(DialogCompletedEzsignComponent);
          this.curpage = null;
         // this.curcase = null;
        }
        this.showProcessSpinner = false;
      });
    } else {
      this.showProcessSpinner = false;
      console.log("Missing data");
      this.dialog.open(DialogMissingDataMessageDialogComponent);
    }
  }

  preSignComplete() {
    this.viewType = "finalview";
  }

  previewDoc() {
    this.showReviewSpinner = true;
    var trackId = this.curcase.ezSignTrackingId;
    var docId = this.curcase.docId;
    this.service.previewEzsignDocPreview(trackId, docId);
    this.showReviewSpinner = false;
  }

  finalizeSigning() {
    this.showSubmitSpinner = true;
    var trackId = this.curcase.ezSignTrackingId;
    var docId = this.curcase.docId;
    this.service.finalizeSigning(trackId, docId).subscribe(resp => {
      console.log(resp);
      this.curpage = null;
      this.curcase = resp;
      this.mycase = resp;
      // this.switchToGrid.emit();
      this.viewType = "";
      this.showSubmitSpinner = false;
      this.dialog.open(DialogCompletedEzsignComponent);
    });
  }
  buildJson() {
    // build fields
    console.log(this.signcapform);
    var fddata = [];
    this.curpage.filterFields.forEach(fd => {
      if (fd.fieldTypeName === 'Signature') {
        // fd.signatureDataUrl = this.myinput[fd.eleId];
        fd.fieldValue = this.myinput[fd.eleId];
      } else {
        fd.fieldValue = this.myinput[fd.eleId];
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

  downloadEzSignDocument() {
    console.log('downloadEzSignDocument...');
    var trackId = this.curcase.ezSignTrackingId;
    var docId = this.curcase.docId;
    this.service.downloadEzsignDocument(trackId,
      this.curcase.documentName);
  }

  //   @ViewChildren(SignaturePad) public sigPadList: QueryList< SignaturePad>;
  //   public signaturePadOptions: any = {
  //     'minWidth': 1,
  //     'canvasWidth': 420,
  //     'canvasHeight': 220,
  //     'backgroundColor': '#FFFFFF'
  //   };
  //   myDate: Date = new Date();
  //   type: string;
  //   selected: any = false;
  //   selectedPaperConsent: any = false;
  //   mycases: any = [];
  //   casefilter = 0;
  //   selectedcase: any = {};
  //   curcase: any = {};
  //   curseq = 0;
  //   cursigner: any = {};
  //   curDocID: any;
  //   curMergeFlag: any;
  //   fprev: any = null;
  //   fnext: any = null;
  //   curpage: any = null;
  //   viewType: any = "";
  //   pdfUrl:  any;
  //   fieldsCount = 0;
  //   signedCount = 0;
  //   agreementselected = false;
  //   signcapform: FormGroup = new FormGroup({});
  //   myinput: any = {};
  //   mysigs: any = {};
  //   showProcessSpinner = false;
  //   constructor(private service: GuestEzsignService, private datepipe: DatePipe,
  //     public dialog: MatDialog) {

  //   }

  //   ngOnInit() {
  //     this.service.getGuestEzsignDoc().subscribe(resp => {
  //       console.log(resp);
  //       this.mycases = [resp];
  //       this.prepareData();
  //       console.log(this.mycases);
  //     });
  //   }

  //   reloadCaseData() {
  //     this.service.getGuestEzsignDoc().subscribe(resp => {
  //       console.log(resp);
  //       this.mycases = [resp];
  //       this.prepareData();
  //       console.log(this.mycases);
  //     });
  //   }
  //   selectcase(docId: any) {
  //     this.mycases.forEach(cc => {
  //       if (cc.docId === docId) {
  //         cc.selected = true;
  //         this.selectedcase = cc;
  //       } else {
  //         cc.selected = false;
  //       }
  //     });
  //   }

  //   tStatus(desc): string {
  //     if (desc === 'Sent to recipient') {
  //       return 'To be signed';
  //     } else {
  //       return desc;
  //     }
  //   }

  //   prepareData() {

  //     if (this.mycases) {
  //     const userID = this.service.auth.getSingerClientID();
  //     this.mycases.forEach(cc => {
  //       if (cc.documentName.length < 40) {
  //         cc.displayName = cc.documentName;
  //       } else {
  //         cc.displayName = cc.documentName.substring(0, 20) + "..." + cc.documentName.substring(cc.documentName.length - 15);
  //       }

  //       cc.completedFields = 0;
  //       cc.readyFields = 0;
  //       cc.eZSignDocPages.forEach(pp => {
  //         if (pp.pageFields) {
  //           pp.pageFields.forEach(ff => {
  //             if (ff.receiverId === userID) {
  //               cc.readyFields = cc.readyFields + 1;
  //               if (ff.status === "Signed") {
  //                 cc.completedFields = cc.completedFields + 1;
  //               }
  //             }
  //           });
  //         }
  //       });
  //     });
  //   }
  //   }

  //   displayReviewDoc(cc: any) {
  //     this.viewType = "reviewDoc";
  //     let firstseq = cc.eZSignDocPages[0].pageSeqNo;
  //     let signer: any = null;
  //     cc.ezSignDocSigners.forEach(ss => {
  //         if (ss.receiverId === this.service.auth.getSingerClientID()) {
  //           signer = ss;
  //         }
  //     });
  //     this.curcase = cc;
  //     this.cursigner = signer;
  //     this.curseq = firstseq;
  //     this.prepareReviewData();
  //   }


  //   prepareReviewData() {
  //     let unsignedforms = [];
  //     if (this.curcase) {
  //       this.curDocID = this.curcase.docId;
  //       let index = 0;
  //       this.fprev = null;
  //       this.fnext = null;
  //       this.curcase.eZSignDocPages.forEach(page => {
  //         if (page.pageSeqNo === this.curseq) {
  //           this.curMergeFlag = page.contentMergeFlag;
  //           if (index > 0) {
  //             this.fprev = this.curcase.eZSignDocPages[index - 1];
  //           }
  //           if (index < this.curcase.eZSignDocPages.length - 1) {
  //             this.fnext = this.curcase.eZSignDocPages[index + 1];
  //           }
  //           this.curpage = page;
  //         }
  //         index = index + 1;
  //       });
  //       this.fieldsCount = 0;
  //       this.signedCount = 0;
  //       if (this.curpage.pageFields) {
  //         this.curpage.pageFields.forEach(fd => {
  //           console.log(this.curcase);
  //           if (fd.receiverId === this.cursigner.receiverId) {
  //             this.fieldsCount = this.fieldsCount + 1;
  //             if (fd.status === 'Signed') {
  //               this.signedCount = this.signedCount + 1;
  //             }
  //           }
  //         });
  //       }
  //       console.log(this.signedCount);
  //       console.log(this.fieldsCount);
  //     }
  //     this.displayPDFDocPage(this.curDocID, this.curseq, this.curMergeFlag);
  //   }

  //   goReviewForm(page: any) {
  //     this.curseq = page.pageSeqNo;
  //     this.prepareReviewData();
  //   }

  //   displayPDFDocPage(docId, seq, mergeFlag) {
  //     let url = this.service.auth.baseurl + '/guestezsign/document/' + docId + "/page/" + seq;
  //     console.log(url);
  //     if (mergeFlag === 'Y') {
  //       url = url + '/mergedform';
  //     }

  //     this.service.getPDFBlob(url).subscribe(resp => {
  //       console.log('got data back!!');
  //       const file = new Blob([<any>resp], {type: 'application/pdf'});
  //       const fileURL = URL.createObjectURL(file);
  //       this.pdfUrl = fileURL;
  //     });
  // }
  //    goAgreementView (cc: any ) {
  //     this.viewType = "";
  //     let signer: any = null;
  //     this.agreementselected = false;
  //     cc.ezSignDocSigners.forEach( ss => {
  //         if (ss.receiverId === this.service.auth.getSingerClientID()) {
  //           signer = ss;
  //         }
  //     });
  //     let firstseq = this.findSignPageSeq(cc, signer);
  //     console.log(firstseq);
  //     if (firstseq > -1) {
  //       this.curcase = cc;
  //       this.curseq = firstseq;
  //       this.cursigner = signer;
  //       this.viewType = "consentview";
  //     } else {
  //       const alert = this.dialog.open(DialogNoFormMessageDialogComponent);
  //     }
  //   }

  //   findSignPageSeq(cc, signer) {
  //       let pseq = -1;
  //       cc.eZSignDocPages.forEach(page => {
  //         console.log(page.pageSeqNo);
  //         let pfcount = 0;
  //         if ( page.status !== "Signed") {
  //           if (page.pageFields) {
  //             page.pageFields.forEach(fd => {
  //               if ((fd.receiverId === signer.receiverId) && (fd.status !== 'Signed')) {
  //                 if (pseq === -1) {
  //                   pseq = page.pageSeqNo;
  //                 }
  //               }
  //             });
  //           }
  //         }
  //       });
  //       return pseq;
  //   }

  //   completeConsent() {
  //     console.log(this.curseq);
  //     this.service.postEzsignAgreementAudit(this.curcase.docId, this.curseq).subscribe(resp => {
  //       if (resp) {
  //         console.log(resp);
  //         this.cursigner.isAgreementAccepted = (<any>resp).isAgreementAccepted;
  //        this.prepareReviewData();
  //        this.viewType = "signingFormView";
  //       }
  //     });

  //   }

  //  filterSignerFields() {
  //     let filtered_fields = [];
  //     this.curpage.pageFields.forEach(fd => {
  //       if (fd.receiverId === this.cursigner.receiverId) {
  //         filtered_fields.push(fd);
  //       }
  //     });
  //     console.log("original field size:", this.curpage.pageFields.length);
  //     console.log("filtered field size:", filtered_fields.length);
  //     this.curpage.filterFields = filtered_fields;
  // }
  // goSignCap() {
  //   this.viewType = "signcapview";
  //   this.signcapform = new FormGroup({});
  //   this.filterSignerFields();
  //   this.curpage.filterFields.forEach(field => {
  //     this.signcapform.addControl(field.labelName, new FormControl('', Validators.required));
  //   });

  //   this.initSigCap();
  //   console.log(this.curpage.filterFields);
  //   console.log(this.cursigner);
  //  }

  //  initSigCap() {
  //    this.myinput = {};
  //    this.mysigs = {};
  //   this.curpage.pageFields.forEach( fd => {
  //     this.myinput[fd.labelName] = "";
  //   });
  //   console.log(this.mysigs);
  //   console.log(this.myinput);
  // }

  //  clearSigCap(field) {
  //   console.log(this.sigPadList.toArray());
  //   let id = field.labelName;
  //   console.log(id);
  //   let index = 0;
  //   let res = this.sigPadList.toArray();
  //   this.curpage.filterFields.forEach(fd => {
  //     if (fd.labelName === id) {
  //       console.log(fd.labelName, "  ", id , index);
  //       res[index].clear();
  //     }
  //     if (fd.fieldTypeName === 'Signature') {index = index + 1; }
  //   });
  //   }

  //   getInput() {
  //     console.log(this.signcapform);
  //     let fields = this.curpage.filterFields;
  //     let allfilled = true;
  //     let sigindex = 0;
  //     let res = this.sigPadList.toArray();
  //     this.curpage.filterFields.forEach( fd => {
  //       if (fd.fieldTypeName === 'Signature') {
  //         this.mysigs[fd.labelName] = res[sigindex];
  //         sigindex = sigindex + 1;
  //       }
  //     });
  //     this.myinput = this.signcapform.value;
  //     fields.forEach(fd => {
  //       const lbl = fd.labelName;
  //       if (fd.fieldTypeName === 'Signature') {
  //         if (this.mysigs[lbl].isEmpty()) {
  //             this.myinput[lbl] = "";
  //           allfilled = false;
  //         } else {
  //           this.myinput[lbl] = this.mysigs[lbl].toDataURL();
  //         }
  //       } else {
  //         if (this.myinput[lbl] == null || this.myinput[lbl] === "") {
  //           allfilled = false;
  //         }
  //       }
  //     });
  //     return allfilled;
  //   }

  //   submitSignCapData() {
  //     this.showProcessSpinner = true;
  //     if (this.getInput()) {
  //       console.log(this.myinput);

  //       let json = this.buildJson();
  //       this.service.postSubmitSignCap(json).subscribe(async res => {
  //           this.curcase = res;
  //           console.log(this.curcase);
  //           this.reloadCaseData();
  //           let nextseq = this.findSignPageSeq(this.curcase, this.cursigner);
  //           console.log("the next page seq:", nextseq);
  //           console.log(nextseq);
  //           if (nextseq > -1) {
  //              this.curseq = nextseq;
  //              this.prepareReviewData();
  //              this.viewType = "signingFormView";
  //           } else {
  //               this.dialog.open(DialogCompletedEzsignComponent);
  //               this.viewType = "";
  //               this.curseq = -1;
  //               this.curpage = null;
  //               this.curcase = null;
  //           }
  //           this.showProcessSpinner = false;
  //       });
  //     } else {
  //       this.showProcessSpinner = false;
  //       console.log("Missing data");
  //       this.dialog.open(DialogMissingDataMessageDialogComponent);
  //     }
  //   }

  //   buildJson() {
  //     var fddata = [];
  //     this.curpage.filterFields.forEach( fd => {
  //         if (fd.fieldTypeName === 'Signature') {
  //           fd.signatureDataUrl = this.myinput[fd.labelName];
  //         } else if (fd.fieldTypeName === 'Date') {
  //           fd.fieldValue = this.datepipe.transform(this.myinput[fd.labelName], 'MM/dd/yyyy');
  //         } else {
  //           fd.fieldValue = this.myinput[fd.labelName];
  //         }
  //         fddata.push(fd);
  //     });
  //     console.log(fddata);
  //     let json = {
  //       ezSignTrackingId: this.curcase.ezSignTrackingId,
  //       status: "",
  //       docId: this.curcase.docId,
  //       eZSignDocPage: {
  //         pageSeqNo: this.curpage.pageSeqNo,
  //         status: "",
  //         contentMergeFlag: "",
  //         pageFields: fddata
  //       }
  //     };
  //     return json;
  //   }

}

@Component({
  selector: 'dialog-noform_message-dialog',
  templateUrl: 'dialog-noform_message-dialog.html',
})
export class DialogNoFormMessageDialogComponent { }
@Component({
  selector: 'dialog-missingdata-message-dialog',
  templateUrl: 'dialog-missingdata-message-dialog.html',
})
export class DialogMissingDataMessageDialogComponent { }

@Component({
  selector: 'dialog-complete-ezsign',
  templateUrl: 'dialog-complete-signing.html',
})
export class DialogCompletedEzsignComponent { }
