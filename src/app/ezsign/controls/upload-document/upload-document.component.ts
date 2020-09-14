import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { SenderdocumentsComponent } from '../senderdocuments/senderdocuments.component';
import { ViewChild, AfterViewInit } from '@angular/core';
import { EzsigndataService } from '../../service/ezsigndata.service';
import { EZSignDocResource } from '../../../esign/beans/ESignCase';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit, AfterViewInit {

  files: any = [];
  ezSignDoc: File;
  uploadedFileName: string;
  senderDocumentCompomentRef: SenderdocumentsComponent;
  showProcessSpinner = false;
  isLinear: any;
  constructor(private ezSignDataService: EzsigndataService, private router: Router) {
    //  dialogRef.disableClose = true;
    }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element);
      this.ezSignDoc = element;
      this.uploadedFileName = element.name;
    }
  }
  deleteAttachment(index) {
    this.files.splice(index, 1);
    this.ezSignDoc = null;
  }

  createNewEZSignDocument() {
    this.showProcessSpinner = true;
    this.ezSignDataService.createNewEZSignDocument(this.ezSignDoc).subscribe(resp => {
      console.log(resp);
     // this.senderDocumentCompomentRef.loadEZSignDocuments();
      if (resp) {
        const ezSignDoc: EZSignDocResource = <EZSignDocResource>resp;
        //  this.loadEZSignDocuments();
        const url = '/main/ezsign/addfields/' + ezSignDoc.ezSignTrackingId;
        this.router.navigateByUrl(url);
      }
      this.showProcessSpinner = false;
      this.closeMe();
    });
  }

  closeMe() {
  //  this.dialogRef.close();
  }
  goToEZSignDocumentsView() {
    this.router.navigateByUrl('main/ezsign/ezsignmain');
  }
}
