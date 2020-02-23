import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../service/esignservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ESignCase, ESignDoc, ESignCPA, ESignClient, ClientReminder, FormMirrorImageData, EsignFormField } from '../../../beans/ESignCase';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-editsigbox',
  templateUrl: './editsigbox.component.html',
  styleUrls: ['./editsigbox.component.scss']
})
export class EditSigboxComponent implements OnInit {
  viewControl: any;
  mycaseId: string;
  status: string;
  primarySigner: ESignClient;
  secondarySigner: ESignClient;
  recurrenceInDays: any;
  subject: string;
  body: string;
  lastReminderDateTime: string;
  sendReminderNow: any;
  clientReminder: ClientReminder;
  priSigCheck: any = true;
  secSigCheck: any = true;
  showbox = false;
  formImageBlobUrl: string;
  docId: string;
  pageSeqNo: string;
  formMirrorImgdata: any;
  isImageDataUrlFetched = false;
  isPriSignatureTagExists = false;
  isSecSignatureTagExists = false;
  isPriDateTagExists = false;
  isSecDateTagExists = false;
  isTitleTagExists = false;
  tpSignaturePosX: number;
  tpSignaturePosY: number;
  tpSignatureHeight: number;
  tpSignatureWidth: number;
  spSignaturePosX: number;
  spSignaturePosY: number;
  spSignatureHeight: number;
  spSignatureWidth: number;
  tpDatePosX: number;
  tpDatePosY: number;
  tpDateHeight: number;
  tpDateWidth: number;
  spDatePosX: number;
  spDatePosY: number;
  spDateHeight: number;
  spDateWidth: number;
  titlePosX: number;
  titlePosY: number;
  titleHeight: number;
  titleWidth: number;
  priSigFieldName: string;
  secSigFieldName: string;
  priDateFieldName: string;
  secDateFieldName: string;
  titleFieldName: string;
  esignFields: EsignFormField[];
  priSigMovingOffset = { x: 0, y: 0 };
  priSigEndOffset = { x: 0, y: 0 };
  secSigMovingOffset = { x: 0, y: 0 };
  secSigEndOffset = { x: 0, y: 0 };
  priDateMovingOffset = { x: 0, y: 0 };
  priDateEndOffset = { x: 0, y: 0 };
  secDateMovingOffset = { x: 0, y: 0 };
  secDateEndOffset = { x: 0, y: 0 };
  titleMovingOffset = { x: 0, y: 0 };
  titleEndOffset = { x: 0, y: 0 };
  showspinner = false;
  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<EditSigboxComponent>, private sanitizer: DomSanitizer) {
      dialogRef.disableClose = true;
      this.viewControl = {
      view: true,
      edit: false,
      createNew: false
    }
  }

  ngOnInit() {
    this.service.getPdfFormMirrorImage(this.docId, this.pageSeqNo).subscribe(resp => {
      console.log('getPdfFormMirrorImage response:')
      this.formMirrorImgdata = resp;
      console.log(this.formMirrorImgdata);
      this.formMirrorImgdata.dataUrl = this.formMirrorImgdata.dataUrl.substring(1, this.formMirrorImgdata.dataUrl.length - 1)
      this.formImageBlobUrl = this.formMirrorImgdata.dataUrl;
      this.esignFields = this.formMirrorImgdata.esignFields;
      console.log(this.esignFields);
      if (this.esignFields) {
        this.esignFields.forEach(ele => {
          if (ele.name === 'SG_TP_Signature' || ele.name === 'DT_TP_Signature'
            || ele.name === 'SG_Fiduciary_Sign_F1' || ele.name === 'SG_Officer_Sign_F1' ||
            ele.name === 'SG_Partner_Sign_F1') {
            this.tpSignaturePosX = ele.posX;
            this.tpSignaturePosY = ele.posY;
            this.tpSignatureHeight = ele.width;
            this.tpSignatureWidth = ele.length;
            console.log(ele.name + ':' + this.tpSignaturePosX + ',' + this.tpSignaturePosY + ',' +
              this.tpSignatureHeight + ',' + this.tpSignatureWidth);
            this.isPriSignatureTagExists = true;
            this.priSigFieldName = ele.name;
          }
          if (ele.name === 'SG_SP_Signature') {
            this.spSignaturePosX = ele.posX;
            this.spSignaturePosY = ele.posY;
            this.spSignatureHeight = ele.width;
            this.spSignatureWidth = ele.length;
            console.log(ele.name + ':' + this.spSignaturePosX + ',' + this.spSignaturePosY + ',' +
              this.spSignatureHeight + ',' + this.spSignatureWidth);
            this.isSecSignatureTagExists = true;
            this.secSigFieldName = ele.name;
          }
          if (ele.name === 'DT_TP_SignDate' || ele.name === 'DT_Fiduciary_Sign_F1'
            || ele.name === 'DT_Officer_Sign_F1' || ele.name === 'DT_Partner_Sign_F1') {
            this.tpDatePosX = ele.posX;
            this.tpDatePosY = ele.posY;
            this.tpDateHeight = ele.width;
            this.tpDateWidth = ele.length;
            console.log(ele.name + ':' + this.tpDatePosX + ',' + this.tpDatePosY + ',' +
              this.tpDateHeight + ',' + this.tpDateWidth);
            this.isPriDateTagExists = true;
            this.priDateFieldName = ele.name;
          }
          if (ele.name === 'DT_SP_SignDate') {
            this.spDatePosX = ele.posX;
            this.spDatePosY = ele.posY;
            this.spDateHeight = ele.width;
            this.spDateWidth = ele.length;
            console.log(ele.name + ':' + this.spDatePosX + ',' + this.spDatePosY + ',' +
              this.spDateHeight + ',' + this.spDateWidth);
            this.isSecDateTagExists = true;
            this.secDateFieldName = ele.name;
          }
          if (ele.name === 'Title_Fiduciary_F1' || ele.name === 'Title_Officer_F1' || ele.name === 'Title_Partner_F1') {
            this.titlePosX = ele.posX;
            this.titlePosY = ele.posY;
            this.titleHeight = ele.width;
            this.titleWidth = ele.length;
            console.log(ele.name + ':' + this.titlePosX + ',' + this.titlePosY + ',' +
              this.titleHeight + ',' + this.titleWidth);
            this.isTitleTagExists = true;
            this.titleFieldName = ele.name;
          }
        });
      }
      this.isImageDataUrlFetched = true;
    });
  }
  initiateEditSigBox(docId: string, pageSeqNo: string) {
    console.log('inside initiateEditSigBox')
    this.docId = docId;
    this.pageSeqNo = pageSeqNo;
  }
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  enableEdit() {
    this.showbox = true;
  }

  saveEdit() {
    this.showspinner = true;
    console.log('inside save edit')
    this.showbox = false;
    this.esignFields.forEach(ele => {
      if (ele.name === 'SG_TP_Signature' || ele.name === 'DT_TP_Signature'
        || ele.name === 'SG_Fiduciary_Sign_F1' || ele.name === 'SG_Officer_Sign_F1' ||
        ele.name === 'SG_Partner_Sign_F1') {
        if (this.priSigEndOffset.x < 0) {
          ele.posX = ele.posX + this.priSigEndOffset.x;
        } else {
          ele.posX = ele.posX + this.priSigEndOffset.x;
        }
        if (this.priSigEndOffset.y < 0) {
          ele.posY = ele.posY - this.priSigEndOffset.y;
        } else {
          ele.posY = ele.posY - this.priSigEndOffset.y;
        }
      }

      if (ele.name === 'SG_SP_Signature') {
        if (this.secSigEndOffset.x < 0) {
          ele.posX = ele.posX + this.secSigEndOffset.x;
        } else {
          ele.posX = ele.posX + this.secSigEndOffset.x;
        }

        if (this.secSigEndOffset.y < 0) {
          ele.posY = ele.posY - this.secSigEndOffset.y;
        } else {
          ele.posY = ele.posY - this.secSigEndOffset.y;
        }
      }

      if (ele.name === 'DT_TP_SignDate' || ele.name === 'DT_Fiduciary_Sign_F1'
        || ele.name === 'DT_Officer_Sign_F1' || ele.name === 'DT_Partner_Sign_F1') {
        if (this.priDateEndOffset.x < 0) {
          ele.posX = ele.posX + this.priDateEndOffset.x;
        } else {
          ele.posX = ele.posX + this.priDateEndOffset.x;
        }

        if (this.priDateEndOffset.y < 0) {
          ele.posY = ele.posY - this.priDateEndOffset.y;
        } else {
          ele.posY = ele.posY - this.priDateEndOffset.y;
        }
      }

      if (ele.name === 'DT_SP_SignDate') {
        if (this.secDateEndOffset.x < 0) {
          ele.posX = ele.posX + this.secDateEndOffset.x;
        } else {
          ele.posX = ele.posX + this.secDateEndOffset.x;
        }
        if (this.secDateEndOffset.y < 0) {
          ele.posY = ele.posY - this.secDateEndOffset.y
        } else {
          ele.posY = ele.posY - this.secDateEndOffset.y;
        }
      }

      if (ele.name === 'Title_Fiduciary_F1' || ele.name === 'Title_Officer_F1' || ele.name === 'Title_Partner_F1') {
        if (this.titleEndOffset.x < 0) {
          ele.posX = ele.posX + this.titleEndOffset.x;
        } else {
          ele.posX = ele.posX + this.titleEndOffset.x;
        }
        if (this.titleEndOffset.y < 0) {
          ele.posY = ele.posY - this.titleEndOffset.y;
        } else { ele.posY = ele.posY - this.titleEndOffset.y; }
      }
    });
    console.log('modified esign fields..')
    console.log(this.esignFields);
    this.service.updateSignatureBoxCoordinates(this.docId, this.pageSeqNo, this.esignFields).subscribe(resp => {
      console.log(resp);
      this.dialogRef.close();
      this.showspinner = false;
    });
  }

  onPriSigStart(event) {
    console.log('started output:', event);
  }
  onPriSigStop(event) {
    console.log('stopped output:', event);
  }
  onPriSigMoving(event) {
    this.priSigMovingOffset.x = event.x;
    this.priSigMovingOffset.y = event.y;
  }
  onPriSigMoveEnd(event) {
    this.priSigEndOffset.x = event.x;
    this.priSigEndOffset.y = event.y;
    console.log(this.priSigEndOffset.x + ',' + this.priSigEndOffset.y);
  }


  onSecSigStart(event) {
    console.log('started output:', event);
  }
  onSecSigStop(event) {
    console.log('stopped output:', event);
  }
  onSecSigMoving(event) {
    this.secSigMovingOffset.x = event.x;
    this.secSigMovingOffset.y = event.y;
  }
  onSecSigMoveEnd(event) {
    this.secSigEndOffset.x = event.x;
    this.secSigEndOffset.y = event.y;
    console.log(this.secSigEndOffset.x + ',' + this.secSigEndOffset.y);
  }

  onDate1Start(event) {
    console.log('started output:', event);
  }
  onDate1Stop(event) {
    console.log('stopped output:', event);
  }
  onDate1Moving(event) {
    this.priDateMovingOffset.x = event.x;
    this.priDateMovingOffset.y = event.y;
  }
  onDate1MoveEnd(event) {
    this.priDateEndOffset.x = event.x;
    this.priDateEndOffset.y = event.y;
    console.log(this.priDateEndOffset.x + ',' + this.priDateEndOffset.y);
  }

  onDate2Start(event) {
    console.log('started output:', event);
  }
  onDate2Stop(event) {
    console.log('stopped output:', event);
  }
  onDate2Moving(event) {
    this.secDateMovingOffset.x = event.x;
    this.secDateMovingOffset.y = event.y;
  }
  onDate2MoveEnd(event) {
    this.secDateEndOffset.x = event.x;
    this.secDateEndOffset.y = event.y;
    console.log(this.secDateEndOffset.x + ',' + this.secDateEndOffset.y);
  }

  onTitleStart(event) {
    console.log('started output:', event);
  }
  onTitleStop(event) {
    console.log('stopped output:', event);
  }
  onTitleMoving(event) {
    this.titleMovingOffset.x = event.x;
    this.titleMovingOffset.y = event.y;
  }
  onMoveEnd(event) {
    this.titleMovingOffset.x = event.x;
    this.titleMovingOffset.y = event.y;
    console.log(this.titleMovingOffset.x + ',' + this.titleMovingOffset.y);
  }

  closeme() {
    this.dialogRef.close();
  }
}
