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
  uploadedFileName: string;
  senderDocumentCompomentRef: SenderdocumentsComponent;
  constructor(private dialogRef: MatDialogRef<UploadDocumentComponent> , private ezSignDataService: EzsigndataService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name)
      this.uploadedFileName = element.name;
    }
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }

  createNewEZSignDocument() {
    this.ezSignDataService.createNewEZSignDocument().subscribe(resp => {
      console.log(resp);
      this.senderDocumentCompomentRef.loadEZSignDocuments();
      this.dialogRef.close();
    });
  }

  closeMe() {
    this.dialogRef.close();
  }
}
