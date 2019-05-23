import { Component, OnInit } from '@angular/core';
import { ESignCase, ESignDoc, ESignCPA } from '../../../beans/ESignCase';
import { EsignserviceService } from '../../../service/esignservice.service';
import {MatDialog} from '@angular/material';
import { EmailpopupComponent} from './emailpopup/emailpopup.component';
import { UploadscanpopupComponent} from './uploadscanpopup/uploadscanpopup.component';
@Component({
  selector: 'app-step2panel',
  templateUrl: './step2panel.component.html',
  styleUrls: ['./step2panel.component.scss']
})
export class Step2panelComponent implements OnInit {
  mycase: ESignCase;
  reviewfiles: File;
  esignfiles: File ;
  paymentfiles: File ;
  paperfiles: File ;
  k1files: File;
  showspinner = false;
  constructor(private service: EsignserviceService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.service.cur_case.subscribe(c => {
      this.mycase = c;
    });
  }

  uploadDoc(type: string, ff: File | FileList) {
    this.service.uploadFile(this.mycase.caseId, type, ff).subscribe( resp => {
      console.log(resp);
      const rr = <{files: ESignDoc[]}> resp;
     // const rr = <ESignCase> resp;
     console.log(rr);
     // this.service.updateCase(rr);
     this.service.updateDocs(rr.files, type);
     switch (type) {
       case 'review':
       this.reviewfiles = null;
       break;
       case 'esign':
       this.esignfiles = null;
       break;
       case 'paper':
       this.paperfiles = null;
       break;
       case 'paymentvoucher':
       this.paymentfiles = null;
       break;
       case 'k1':
       this.k1files = null;
       break;
     }
  },
  error => console.log(error)
  );
  }

  classifyEsignDoc() {
    this.service.classify(this.mycase.caseId, 'CPA006').subscribe(resp => {
      const res_c = <{classification: ESignDoc[]}> resp;
      console.log(res_c);
      this.service.updateClassificationPages(res_c.classification);
      });
  }

  uploadScanDoc(type: string, ff: File | FileList) {
    this.showspinner = true;
    this.service.uploadscanFile(this.mycase.caseId, type, ff).subscribe( resp => {
      switch (type) {
        case 'review':
        this.reviewfiles = null;
        break;
        case 'esign':
        this.esignfiles = null;
        break;
        case 'paper':
        this.paperfiles = null;
        break;
        case 'paymentvoucher':
        this.paymentfiles = null;
        break;
        case 'k1':
        this.k1files = null;
        break;
      }
      console.log(resp);
     const scandoc = (<any>resp).classification[0];  // first document of the scanupload
     const dialogRef = this.dialog.open(UploadscanpopupComponent, {
      width: '900px' });
     // dialogRef.componentInstance.setPDF(res.classification[0].docId);
     dialogRef.componentInstance.setScanDoc(scandoc, this.mycase.caseId);
     this.showspinner = false;
  },
  error => {
    console.log(error); this.showspinner = false; }
  );
  }
}
