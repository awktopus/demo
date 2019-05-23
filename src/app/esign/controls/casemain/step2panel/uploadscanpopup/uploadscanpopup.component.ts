import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Component, ViewEncapsulation, ViewChild, ElementRef, PipeTransform, Pipe, OnInit, Inject } from '@angular/core';
import {FormControl} from '@angular/forms';
import { EsignserviceService } from '../../../../service/esignservice.service';
import { EsignuiserviceService } from '../../../../service/esignuiservice.service';
import { ESignCase, ESignCPA, ESignDoc, ClassifyPage, ESignField } from '../../../../beans/ESignCase';
import { SafePipe } from '../../../../esign.component';
@Component({
  selector: 'app-uploadscanpopup',
  templateUrl: './uploadscanpopup.component.html',
  styleUrls: ['./uploadscanpopup.component.scss']
})
export class UploadscanpopupComponent implements OnInit {
  pdfSrc = '';
  fcctrl: FormControl = new FormControl();
  formval: string;
  formlist: string[];
  selectedForm: string;
  newPageN: string;
  scandoc: any;
  mycaseID: string;
  errormsg: string;
  constructor( private service: EsignserviceService,
    private uiservice: EsignuiserviceService,
    public dialogRef: MatDialogRef<UploadscanpopupComponent>) { }

  ngOnInit() {
    this.fcctrl.valueChanges.subscribe(val => {
      if (val && typeof val !== 'object') {
        // console.log(val);
         if ( this.formval === val.trim()) {
           return;
         } else {
           this.uiservice.searchFormcodes( val).subscribe(resp => {
              const rr = <{formCodes: string[]}> resp;
              this.formlist = rr.formCodes;
           });
         }
       }
    });
  }

  setPDF(docId: string): void {
    const loc = this.service.auth.baseurl + '/Contents/' + docId;
    console.log(loc);
    this.service.getPDFBlob(loc).subscribe(resp => {
       // console.log(resp);
       const file = new Blob([<any>resp], {type: 'application/pdf'});
       const fileURL = URL.createObjectURL(file);
       console.log('set pdf:' + fileURL);
       this.pdfSrc = fileURL;
    });
   }

   closeme(): void {
    this.dialogRef.close();
  }

  setScanDoc(doc: any, caseID: string ) {
    this.scandoc = doc;
    this.setPDF(doc.docId);
    this.mycaseID = caseID;
  }

  deletePage(fpage) {
    console.log(fpage);
    // find index
    let pi = 0;
    for (let i = 0; i < this.scandoc.pages.length; i++) {
      if (this.scandoc.pages[i] === fpage) {
        pi = i;
      }
    }
    this.scandoc.pages.splice(pi, 1);
  }

  addPage(): void {
    this.errormsg = '';
    const pn: any = this.newPageN;
    // check if this is number
    if (isNaN(pn)) {
      this.errormsg = 'Wrong Page Number';
      return;
    }
    let found = false;
    const pnn: number = Number(this.newPageN);
    if ( pnn < 1 || pnn > this.scandoc.pageCount) {
      this.errormsg = 'Page number out of index';
      return;
    }
    if ( this.selectedForm === '' || (!this.selectedForm)) {
      this.errormsg = 'Missing assigned form';
      return;
    }
    console.log(pnn, this.selectedForm);
    this.scandoc.pages.forEach(p => {
      if (p.seqNo === pnn) {
        found = true;
      }
    });
    if (found) {
      this.errormsg = 'page already exist';
      return;
    }
    // now update the pages
    this.scandoc.pages.push({seqNo: pnn, formCode: this.selectedForm});
    this.newPageN = '';
    this.selectedForm = '';
  }
  discardandclose() {
    console.log('discard the document');
    this.service.deleteDoc(this.scandoc.docId).subscribe(resp  => {
      this.closeme();
    });
  }

  submitDoc() {
    console.log('submit esign docs');
    const pp = [];
    this.scandoc.pages.forEach(p => {
      pp.push({SeqNo: p.seqNo, FormCode: p.formCode });
    });
    const json = {
      CpaId: this.service.auth.getUserID(),
      FileName: this.scandoc.fileName,
      PageCount: this.scandoc.pageCount,
      pages: pp
    };
    console.log(json);
    this.service.completeESignUpload(this.mycaseID, this.scandoc.docId, json).subscribe(resp => {
      console.log(resp);
      const docs = <ESignDoc[]> (<any>resp).classification;
      this.service.updateDocs(docs, 'esign')
      this.service.updateClassificationPages(docs);
      this.closeme();
    });
  }
}
