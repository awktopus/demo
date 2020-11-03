import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SenderdocumentsComponent } from '../senderdocuments/senderdocuments.component';
import { ViewChild, AfterViewInit } from '@angular/core';
import { EzsigndataService } from '../../service/ezsigndata.service';
import { EZSignDocResource } from '../../../esign/beans/ESignCase';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit, AfterViewInit {

  files: any = [];
  ezSignFileList: File;
  uploadedFileName: string;
  senderDocumentCompomentRef: SenderdocumentsComponent;
  showProcessSpinner = false;
  isLinear: any;
  documentTitle = null;
  constructor(private ezSignDataService: EzsigndataService, private snackBar: MatSnackBar,
    private router: Router) {
    //  dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  uploadFile(event) {
    console.log('upload file');
    console.log(event);
    this.ezSignFileList = event;
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element);
      this.uploadedFileName = element.name;
      if (index === 0) {
        this.documentTitle = element.name;
      }
    }
  }

  deleteAttachment(index) {
    console.log('delete attachment');
    console.log(index);
    this.files.splice(index, 1);
    this.ezSignFileList = this.files;
    this.documentTitle = null;
    console.log(this.ezSignFileList);
    if (this.files) {
      for (let i = 0; i < this.files.length; i++) {
        if (i === 0) {
          this.documentTitle = this.files[i].name;
        }
      }
    }
  }

  createNewEZSignDocument() {
    if (this.documentTitle === null || this.documentTitle === "") {
      this.snackBar.open("Please enter the document title", '', { duration: 3000 });
      return;
    }
    this.showProcessSpinner = true;
    this.ezSignDataService.createNewEZSignDocument(this.ezSignFileList, this.documentTitle).subscribe(resp => {
      console.log(resp);
      if (resp) {
        const ezSignDoc: EZSignDocResource = <EZSignDocResource>resp;
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
