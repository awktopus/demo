import { Component, OnInit } from '@angular/core';
import { ESignCase, ESignDoc, ClassifyPage, ESignField } from '../../../beans/ESignCase';
import { EsignserviceService } from '../../../service/esignservice.service';
import {MatDialog} from '@angular/material';
import { PdfpopupComponent } from './pdfpopup/pdfpopup.component';
import { SignerselectionComponent } from './signerselection/signerselection.component';
import { EditSigboxComponent } from '../editsigbox/editsigbox.component';
@Component({
  selector: 'app-esigncase',
  templateUrl: './esigncase.component.html',
  styleUrls: ['./esigncase.component.scss']
})
export class EsigncaseComponent implements OnInit {
  mycase: ESignCase;
  constructor(private service: EsignserviceService, public dialog: MatDialog) { }

  ngOnInit() {
    this.service.cur_case.subscribe(c => {
      this.mycase = c;
     // console.log('subscribe');
       console.log(c);
    });
  }

  deleteDoc(docId: string, type: string) {
    console.log(docId, type);
        this.service.deleteDoc(docId).subscribe(resp => {
        console.log(resp);
        const rr = <{files: ESignDoc[]}> resp;
       // const rr = <ESignCase> resp;
        console.log(rr);
       // this.service.updateCase(rr);
       this.service.updateDocs(rr.files, type, docId);
    });
  }

  showDoc(docId: string) {
    console.log(docId);
    const dialogRef = this.dialog.open(PdfpopupComponent, { width: '520pt'});
    dialogRef.componentInstance.setPDF(this.service.auth.baseurl + '/Contents/' + docId);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  showPageUC(page: ClassifyPage) {
    const dialogRef = this.dialog.open(PdfpopupComponent, { width: '520pt'});
    dialogRef.componentInstance.setPDF(this.service.auth.baseurl + '/Contents/' + page.docId + '/' + page.seqNo);
    dialogRef.componentInstance.setclassify(page, true);
  }
  showMergePage(page: ClassifyPage) {
    const dialogRef = this.dialog.open(PdfpopupComponent, { width: '520pt'});
    dialogRef.componentInstance.setPDF(this.service.auth.baseurl + '/Contents/' + page.docId + '/' + page.seqNo + '/mergedform');
  }
  showPage(page: ClassifyPage) {
    const dialogRef = this.dialog.open(PdfpopupComponent, { width: '520pt'});
    dialogRef.componentInstance.setPDF(this.service.auth.baseurl + '/Contents/' + page.docId + '/' + page.seqNo);
    dialogRef.componentInstance.setclassify(page, false);
  }

  showEditSigBoxPage(page) {
    console.log(page);
    const dialogRef = this.dialog.open(EditSigboxComponent, { width: '615pt', height: '793pt'});
    dialogRef.componentInstance.initiateEditSigBox(page.docId, page.seqNo);
   }

  deletePage(docId: string, pageSeq: number) {
    this.service.deletePage(docId, pageSeq).subscribe(result => {
        console.log(result);
        const res_c = <{classification: ESignDoc[]}> result;
        this.service.updateClassificationPages(res_c.classification);
    });
  }

  deleteCoverLetter(docId: string) {
    console.log(docId);
    this.service.deleteDoc(docId).subscribe(resp => {
      const res = <{files: ESignDoc[]}> resp;
      if (res.files.length === 0) {
        this.service.updateCoverLetter(null);
      } else {
        this.service.updateCoverLetter(res.files);
      }
    });
  }
  downloadDoc(caseId: string) {
    console.log('download esigned doc for case:' + caseId);
    this.service.downloadESignedDoc(caseId);
    // window.open(this.service.baseurl + '/Contents/Case/' + caseId + '/signedform');
  }

  selectSigner(caseId: string, docId: string, seqNo: string, signedPartyOption: string, signatureBoxCount: number) {
      const dialogRef = this.dialog.open(SignerselectionComponent, { width: '320pt'});
      dialogRef.componentInstance.setSignedPartyPopupInfo(caseId, docId, seqNo, signedPartyOption, signatureBoxCount);
      dialogRef.componentInstance.eSignCaseComponent = this;
  }
  showPageWithESignbox(page: ClassifyPage) {
    const dialogRef = this.dialog.open(PdfpopupComponent, {  width: '615pt', height: '650pt'});
    dialogRef.componentInstance.setPDF(this.service.auth.baseurl + '/Contents/' + page.docId + '/' + page.seqNo + '/formwithesignboxes');
    dialogRef.componentInstance.setclassify(page, false);
  }
}
