import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { SenderdocumentsComponent } from '../senderdocuments/senderdocuments.component';
import { ViewChild, AfterViewInit } from '@angular/core';
import { EzsigndataService } from '../../service/ezsigndata.service';
import { EZSignDocResource } from '../../../esign/beans/ESignCase';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
  constructor(private dialogRef: MatDialogRef<UploadDocumentComponent> , private ezSignDataService: EzsigndataService) { }

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
      this.showProcessSpinner = false;
      this.senderDocumentCompomentRef.loadEZSignDocuments();
      this.closeMe();
    });
  }

  closeMe() {
    this.dialogRef.close();
  }
}
