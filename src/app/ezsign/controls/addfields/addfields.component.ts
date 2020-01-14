import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelect, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatFormField } from '@angular/material';
import {
  ESignCase, ESignDoc, ESignCPA, ESignClient, ClientReminder, Signer,
  EZSignPageImageData, EsignFormField, SignatureField, DateField, TextField, EZSignDocResource
} from '../../../esign/beans/ESignCase';
import { EsignserviceService } from '../../../esign/service/esignservice.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizeEvent } from 'angular-resizable-element';
import { Router } from '@angular/router';
import { EzsigndataService } from '../../service/ezsigndata.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddsignersComponent } from '../addsigners/addsigners.component';
import { InvitesignersComponent } from '../invitesigners/invitesigners.component';
@Component({
  selector: 'app-addfields',
  templateUrl: './addfields.component.html',
  styleUrls: ['./addfields.component.scss']
})
export class AddfieldsComponent implements OnInit {
  public style: object = {};
  ezSignTrackingId: string;
  docId: string;
  pageSeqNo: number;
  pageCount: number;
  isPreviousPageLoading = false;
  isNextPageLoading = false;
  title: string;
  showSignaturebox = false;
  showTextbox = false;
  showDatebox = false;
  formImageBlobUrl: string;
  ezSignPageImageData: EZSignPageImageData;
  signatureFields: SignatureField[] = [];
  dateFields: DateField[] = [];
  textFields: TextField[] = [];
  isImageDataUrlFetched = false;
  isSignatureTagExists = false;
  isDateTagExists = false;
  isTextTagExists = false;
  signatureFieldName: string;
  textFieldName: string;
  dateFieldName: string;
  signaturePosX: number;
  signaturePosY: number;
  signatureHeight: number;
  signatureWidth: number;

  textPosX: number;
  textPosY: number;
  textHeight: number;
  textWidth: number;

  datePosX: number;
  datePosY: number;
  dateHeight: number;
  dateWidth: number;

  //  esignFields: EsignFormField[];
  sigFieldSelected: any;
  textFieldSelected: any;
  dateFieldSelected: any;

  sigMovingOffset = { x: 0, y: 0 };
  sigEndOffset = { x: 0, y: 0 };
  textMovingOffset = { x: 0, y: 0 };
  textEndOffset = { x: 0, y: 0 };
  dateMovingOffset = { x: 0, y: 0 };
  dateEndOffset = { x: 0, y: 0 };

  showspinner = false;
  eZSigners: Signer[];
  activeSignatureFieldSeqNo: number;
  activeTextFieldSeqNo: number;
  activeDateFieldSeqNo: number;
  inBounds = true;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  showSigProcess1Spinner = false;
  showSigProcess2Spinner = false;
  showTextProcess1Spinner = false;
  showTextProcess2Spinner = false;
  showDateProcess1Spinner = false;
  showDateProcess2Spinner = false;
  dateFieldForm: FormGroup = new FormGroup({
    dateLabelControl: new FormControl('', Validators.required),
  });

  textFieldForm: FormGroup = new FormGroup({
    textLabelControl: new FormControl('', Validators.required),
    textControl: new FormControl('', Validators.required)
  });

  signatureFieldForm: FormGroup = new FormGroup({
    signatureLabelControl: new FormControl('', Validators.required),
    signerControl: new FormControl('', Validators.required)
  });

  @ViewChild('focusSignatureField') focusSignatureField: MatSelect;

  constructor(private service: EzsigndataService, public dialog: MatDialog,
    private sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log('add fields ngOnInit');

    this.route.paramMap.subscribe(para => {
      this.ezSignTrackingId = para.get('trackingId');
      console.log(this.ezSignTrackingId);

      this.service.getEZSignPdfFormMirrorImageByTrackingId(this.ezSignTrackingId).subscribe(resp => {
        console.log('getPdfFormMirrorImage response:')
        this.ezSignPageImageData = resp;
        console.log(this.ezSignPageImageData);
        this.ezSignPageImageData.dataUrl = this.ezSignPageImageData.dataUrl.substring(1, this.ezSignPageImageData.dataUrl.length - 1)
        this.formImageBlobUrl = this.ezSignPageImageData.dataUrl;
        this.docId = this.ezSignPageImageData.docId;
        this.pageSeqNo = this.ezSignPageImageData.pageSeqNo;
        this.pageCount = this.ezSignPageImageData.pageCount;
        this.title = this.ezSignPageImageData.title;

        if (this.ezSignPageImageData.signatureFields) {
          this.signatureFields = this.ezSignPageImageData.signatureFields;
          console.log('signature fields');
          console.log(this.signatureFields);
        }

        if (this.ezSignPageImageData.textFields) {
          this.textFields = this.ezSignPageImageData.textFields;
          console.log('text fields');
          console.log(this.textFields);
        }

        if (this.ezSignPageImageData.dateFields) {
          this.dateFields = this.ezSignPageImageData.dateFields;
          console.log('date fields');
          console.log(this.dateFields);
        }
        // this.tpSignaturePosX = ele.posX;
        // this.tpSignaturePosY = ele.posY;
        // this.tpSignatureHeight = ele.width;
        // this.tpSignatureWidth = ele.length;
        // console.log(ele.name + ':' + this.tpSignaturePosX + ',' + this.tpSignaturePosY + ',' +
        //   this.tpSignatureHeight + ',' + this.tpSignatureWidth);

        this.service.getEZSignSigners(this.ezSignTrackingId).subscribe(respSigners => {
          console.log(respSigners);
          this.eZSigners = respSigners;
        });
        this.isImageDataUrlFetched = true;
      });
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  loadEZSignDocPage(docId: string, pageSeqNo: any, actionType: string) {

    this.service.getEZSignPdfFormMirrorImage(this.ezSignTrackingId, docId, pageSeqNo).subscribe(resp => {
      console.log('getPdfFormMirrorImage response:')
      this.sigFieldSelected = '';
      this.textFieldSelected = '';
      this.dateFieldSelected = '';
      this.ezSignPageImageData = resp;
      console.log(this.ezSignPageImageData);
      this.ezSignPageImageData.dataUrl = this.ezSignPageImageData.dataUrl.substring(1, this.ezSignPageImageData.dataUrl.length - 1)
      this.formImageBlobUrl = this.ezSignPageImageData.dataUrl;
      this.docId = this.ezSignPageImageData.docId;
      this.pageSeqNo = this.ezSignPageImageData.pageSeqNo;
      this.pageCount = this.ezSignPageImageData.pageCount;
      if (this.ezSignPageImageData.signatureFields) {
        this.signatureFields = this.ezSignPageImageData.signatureFields;
        console.log('signature fields');
        console.log(this.signatureFields);
      } else {
        this.signatureFields = this.ezSignPageImageData.signatureFields;
      }

      if (this.ezSignPageImageData.textFields) {
        this.textFields = this.ezSignPageImageData.textFields;
        console.log('text fields');
        console.log(this.textFields);
      } else {
        this.textFields = this.ezSignPageImageData.textFields;
      }

      if (this.ezSignPageImageData.dateFields) {
        this.dateFields = this.ezSignPageImageData.dateFields;
        console.log('date fields');
        console.log(this.dateFields);
      } else {
        this.dateFields = this.ezSignPageImageData.dateFields;
      }

      this.isImageDataUrlFetched = true;
      if (actionType === 'previous') {
        if (pageSeqNo === 1) {
          this.pageSeqNo = 1;
        } else {
          this.pageSeqNo = this.pageSeqNo - 1;
        }
        this.isPreviousPageLoading = false;
      }
      if (actionType === 'next') {
        if (pageSeqNo === this.pageCount) {
          this.pageSeqNo = this.pageCount;
        } else {
          this.pageSeqNo = this.pageSeqNo + 1;
        }
        this.isNextPageLoading = false;
      }
      console.log('new page sequence:' + this.pageSeqNo);
    });
  }

  showPreviousPage() {
    console.log('showPreviousPage');
    this.isPreviousPageLoading = true;
    this.loadEZSignDocPage(this.docId, this.pageSeqNo - 1, 'previous');
  }

  showNextPage() {
    console.log('showNextPage');
    this.isNextPageLoading = true;
    this.loadEZSignDocPage(this.docId, this.pageSeqNo + 1, 'next');
  }

  addField(fieldType: string) {
    console.log('add field - start');
    console.log('fieldType:' + fieldType);
    if (fieldType === 'signature') {
      if (!this.signatureFields) {
        this.signatureFields = [];
      }
      let fieldCount = this.signatureFields.length;
      fieldCount = fieldCount + 1;
      this.activeSignatureFieldSeqNo = fieldCount;
      let sigField = new SignatureField();
      sigField.fieldSeqNo = fieldCount;
      sigField.signaturePosX = 108;
      sigField.signaturePosY = 320;
      sigField.signatureHeight = 18;
      sigField.signatureWidth = 140;
      sigField.showSignaturebox = true;
      sigField.isSignatureTagExists = true;
      this.sigFieldSelected = 'signature';
      this.textFieldSelected = '';
      this.dateFieldSelected = '';
      sigField.signatureFieldName = "Signature";
      this.signatureFields.push(sigField);
      console.log(sigField);
      console.log(this.signatureFields);
      this.signatureFieldForm.reset();
      console.log('add field - end');
    } else if (fieldType === 'text') {
      console.log('fieldType:' + fieldType);
      if (!this.textFields) {
        this.textFields = [];
      }
      let fieldCount = this.textFields.length;
      fieldCount = fieldCount + 1;
      this.activeTextFieldSeqNo = fieldCount;
      let textField = new TextField();
      textField.textPosX = 108;
      textField.textPosY = 220;
      textField.textHeight = 14;
      textField.textWidth = 151;
      this.textFieldSelected = 'text';
      this.sigFieldSelected = '';
      this.dateFieldSelected = '';
      textField.showTextbox = true;
      textField.isTextTagExists = true;
      textField.textFieldName = "Text";
      this.textFields.push(textField);
      console.log(textField);
      console.log(this.textFields);
      this.textFieldForm.reset();

    } else if (fieldType === 'date') {
      console.log('fieldType:' + fieldType);
      if (!this.dateFields) {
        this.dateFields = [];
      }
      let fieldCount = this.dateFields.length;
      fieldCount = fieldCount + 1;
      this.activeDateFieldSeqNo = fieldCount;
      let dateField = new DateField();
      dateField.datePosX = 108;
      dateField.datePosY = 120;
      dateField.dateHeight = 14;
      dateField.dateWidth = 151;
      this.dateFieldSelected = 'date';
      this.sigFieldSelected = '';
      this.textFieldSelected = '';
      dateField.showDatebox = true;
      dateField.isDateTagExists = true;
      dateField.dateFieldName = "Date";
      this.dateFields.push(dateField);
      console.log(dateField);
      console.log(this.dateFields);
      this.dateFieldForm.reset();
    }
  }

  saveSignatureField() {
    this.showSigProcess1Spinner = true;
    console.log('save signature field - start');
    console.log(this.activeSignatureFieldSeqNo);
    let boxX;
    let boxY;
    if (this.signatureFields) {
    this.signatureFields.forEach(sf => {
      if (sf.fieldSeqNo === this.activeSignatureFieldSeqNo) {
        if (this.sigEndOffset.x < 0) {
          sf.signaturePosX = sf.signaturePosX + this.sigEndOffset.x;
          boxX = sf.signaturePosX;
        } else {
          sf.signaturePosX = sf.signaturePosX + this.sigEndOffset.x;
          boxX = sf.signaturePosX;
        }
        if (this.sigEndOffset.y < 0) {
          sf.signaturePosY = sf.signaturePosY - this.sigEndOffset.y;
          boxY = sf.signaturePosY;
        } else {
          sf.signaturePosY = sf.signaturePosY - this.sigEndOffset.y;
          boxY = sf.signaturePosY;
        }
      }
    });
  }
    const newFieldInfo = {
      fieldSeqNo: this.activeSignatureFieldSeqNo,
      fieldTypeId: 1,
      labelName: this.signatureFieldForm.controls['signatureLabelControl'].value,
      boxX: boxX,
      boxY: boxY,
      width: 140,
      height: 18,
      receiverId: this.signatureFieldForm.controls['signerControl'].value,
      status: "Uploaded"
    };
    console.log(newFieldInfo);
    this.service.addFieldToEZSignPage(this.ezSignTrackingId, this.docId,
      this.pageSeqNo, newFieldInfo).subscribe(resp => {
        let ezSignPageTempData: EZSignPageImageData;
        ezSignPageTempData = resp;
        this.signatureFields = [];
        if (ezSignPageTempData.signatureFields) {
          this.signatureFields = ezSignPageTempData.signatureFields;
          console.log('updated signature fields after save signature field');
          console.log(this.signatureFields);
          console.log('save signature field - end');
          this.showSigProcess1Spinner = false;
        }
      });
  }

  removeSignatureField(fieldSeqNo: number) {
    this.showSigProcess2Spinner = true;
    console.log('removeSignatureField' + fieldSeqNo);
    this.service.deleteFieldFromEZSignPage(this.ezSignTrackingId, this.docId,
      this.pageSeqNo, this.activeSignatureFieldSeqNo, 1).subscribe(resp => {
        let ezSignPageTempData: EZSignPageImageData;
        ezSignPageTempData = resp;
        if (ezSignPageTempData.signatureFields) {
          this.signatureFields = ezSignPageTempData.signatureFields;
          console.log('updated signature fields');
          console.log(this.signatureFields);
          this.sigFieldSelected = '';
        } else {
          this.signatureFields = null;
          this.sigFieldSelected = '';
        }
        this.showSigProcess2Spinner = false;
      });
  }

  deleteSignatureField() {
    console.log('delete signature field - start');
    this.removeSignatureField(this.activeSignatureFieldSeqNo);
    console.log('delete signature field - end');
  }

  confirmSignatureField(fieldSeqNo: number) {
    console.log('confirm signature field - start');
    console.log('confirm signature field' + fieldSeqNo);
    this.sigFieldSelected = 'signature';
    this.textFieldSelected = '';
    this.dateFieldSelected = '';
    // this.activeSignatureFieldSeqNo = fieldSeqNo;
    console.log(this.signatureFields);
    if (this.signatureFields) {
      this.signatureFields.forEach(sf => {
        if (sf.fieldSeqNo === fieldSeqNo) {
          this.signatureFieldForm.controls['signatureLabelControl'].setValue(sf.labelName);
          this.signatureFieldForm.controls['signerControl'].setValue(sf.receiverId);
          console.log('confirm signature field - end');
        }
      })
    }
    // this.focusSignatureField.focused = true;
  }

  onSigStart(event, fieldSeqNo: number) {
    // console.log('started output:', event);
    // this.activeSignatureFieldSeqNo = fieldSeqNo;
  }
  onSigStop(event, fieldSeqNo: number) {
    console.log('stopped output:', event);
    console.log('active signature field seq no:' + this.activeSignatureFieldSeqNo);
    this.activeSignatureFieldSeqNo = fieldSeqNo;
    this.confirmSignatureField(this.activeSignatureFieldSeqNo);
  }
  onSigMoving(event, fieldSeqNo: number) {
    this.sigMovingOffset.x = event.x;
    this.sigMovingOffset.y = event.y;
    //  this.activeSignatureFieldSeqNo = fieldSeqNo;
  }
  onSigMoveEnd(event, fieldSeqNo: number) {
    this.sigEndOffset.x = event.x;
    this.sigEndOffset.y = event.y;
    // console.log(this.sigEndOffset.x + ',' + this.sigEndOffset.y);
    //  this.activeSignatureFieldSeqNo = fieldSeqNo;
  }




  removeTextField(fieldSeqNo: number) {
    this.showTextProcess2Spinner = true;
    console.log('removeTextField' + fieldSeqNo);
    this.service.deleteFieldFromEZSignPage(this.ezSignTrackingId, this.docId,
      this.pageSeqNo, this.activeTextFieldSeqNo, 2).subscribe(resp => {
        let ezSignPageTempData: EZSignPageImageData;
        ezSignPageTempData = resp;
        if (ezSignPageTempData.textFields) {
          this.textFields = ezSignPageTempData.textFields;
          console.log('updated text fields');
          console.log(this.textFields);
          this.textFieldSelected = '';
        } else {
          this.textFields = null;
          this.textFieldSelected = '';
        }
        this.showTextProcess2Spinner = false;
      });
  }
  deleteTextField() {
    console.log('delete text field');
    this.removeTextField(this.activeTextFieldSeqNo);
  }
  confirmTextField(fieldSeqNo: number) {
    console.log('confirm text field' + fieldSeqNo);
    this.textFieldSelected = 'text';
    this.sigFieldSelected = '';
    this.dateFieldSelected = '';
    this.activeTextFieldSeqNo = fieldSeqNo;
    console.log(this.textFields);
    if (this.textFields) {
      this.textFields.forEach(tf => {
        if (tf.fieldSeqNo === fieldSeqNo) {
          this.textFieldForm.controls['textLabelControl'].setValue(tf.labelName);
          this.textFieldForm.controls['textControl'].setValue(tf.receiverId);
        }
      })
    }
  }
  saveTextField() {
    this.showTextProcess1Spinner = true;
    console.log('save text field');
    console.log(this.activeTextFieldSeqNo);
    let boxX;
    let boxY;
    if (this.textFields) {
    this.textFields.forEach(tf => {
      if (tf.fieldSeqNo === this.activeTextFieldSeqNo) {
        if (this.textEndOffset.x < 0) {
          tf.textPosX = tf.textPosX + this.textEndOffset.x;
          boxX = tf.textPosX;
        } else {
          tf.textPosX = tf.textPosX + this.textEndOffset.x;
          boxX = tf.textPosX;
        }
        if (this.textEndOffset.y < 0) {
          tf.textPosY = tf.textPosY - this.textEndOffset.y;
          boxY = tf.textPosY;
        } else {
          tf.textPosY = tf.textPosY - this.textEndOffset.y;
          boxY = tf.textPosY;
        }
      }
    });
  }
    const newFieldInfo = {
      fieldSeqNo: this.activeTextFieldSeqNo,
      fieldTypeId: 2,
      labelName: this.textFieldForm.controls['textLabelControl'].value,
      boxX: boxX,
      boxY: boxY,
      width: 140,
      height: 18,
      receiverId: this.textFieldForm.controls['textControl'].value,
      status: "Uploaded"
    };
    console.log(newFieldInfo);
    this.service.addFieldToEZSignPage(this.ezSignTrackingId, this.docId,
      this.pageSeqNo, newFieldInfo).subscribe(resp => {
        let ezSignPageTempData: EZSignPageImageData;
        ezSignPageTempData = resp;
        if (ezSignPageTempData.textFields) {
          this.textFields = ezSignPageTempData.textFields;
          console.log('updated text fields after save text field');
          console.log(this.textFields);
          this.showTextProcess1Spinner = false;
        }
      });
  }


  removeDateField(fieldSeqNo: number) {
    this.showDateProcess2Spinner = true;
    console.log('removeDateField' + fieldSeqNo);
    this.service.deleteFieldFromEZSignPage(this.ezSignTrackingId, this.docId,
      this.pageSeqNo, this.activeDateFieldSeqNo, 3).subscribe(resp => {
        let ezSignPageTempData: EZSignPageImageData;
        ezSignPageTempData = resp;
        if (ezSignPageTempData.dateFields) {
          this.dateFields = ezSignPageTempData.dateFields;
          console.log('updated date fields');
          console.log(this.dateFields);
          this.dateFieldSelected = '';
        } else {
          this.dateFields = null;
          this.dateFieldSelected = '';
        }
        this.showDateProcess2Spinner = false;
      });
  }
  deleteDateField() {
    console.log('delete date field');
    this.removeDateField(this.activeDateFieldSeqNo);
  }
  confirmDateField(fieldSeqNo: number) {
    console.log('confirm date field' + fieldSeqNo);
    this.dateFieldSelected = 'date';
    this.sigFieldSelected = '';
    this.textFieldSelected = '';
    this.activeDateFieldSeqNo = fieldSeqNo;
    console.log(this.dateFields);
    if (this.dateFields) {
      this.dateFields.forEach(df => {
        if (df.fieldSeqNo === fieldSeqNo) {
          this.dateFieldForm.controls['dateLabelControl'].setValue(df.labelName);
        }
      })
    }
  }
  saveDateField() {
    this.showDateProcess1Spinner = true;
    console.log('save date field');
    console.log(this.activeDateFieldSeqNo);
    let boxX;
    let boxY;
    if (this.dateFields) {
    this.dateFields.forEach(df => {
      if (df.fieldSeqNo === this.activeTextFieldSeqNo) {
        if (this.dateEndOffset.x < 0) {
          df.datePosX = df.datePosX + this.dateEndOffset.x;
          boxX = df.datePosX;
        } else {
          df.datePosX = df.datePosX + this.dateEndOffset.x;
          boxX = df.datePosX;
        }
        if (this.textEndOffset.y < 0) {
          df.datePosY = df.datePosY - this.dateEndOffset.y;
          boxY = df.datePosY;
        } else {
          df.datePosY = df.datePosY - this.dateEndOffset.y;
          boxY = df.datePosY;
        }
      }
    });
  }
    const newFieldInfo = {
      fieldSeqNo: this.activeDateFieldSeqNo,
      fieldTypeId: 3,
      labelName: this.dateFieldForm.controls['dateLabelControl'].value,
      boxX: boxX,
      boxY: boxY,
      width: 140,
      height: 18,
      receiverId: '',
      status: "Uploaded"
    };
    console.log(newFieldInfo);
    this.service.addFieldToEZSignPage(this.ezSignTrackingId, this.docId,
      this.pageSeqNo, newFieldInfo).subscribe(resp => {
        let ezSignPageTempData: EZSignPageImageData;
        ezSignPageTempData = resp;
        if (ezSignPageTempData.dateFields) {
          this.dateFields = ezSignPageTempData.dateFields;
          console.log('updated date fields after save date field');
          console.log(this.dateFields);
          this.showDateProcess1Spinner = false;
        }
      });
  }




  checkEdge(event) {
    this.edge = event;
    console.log('edge:', event);
  }

  onTextStart(event, fieldSeqNo: number) {
    console.log('started output:', event);
    // this.activeTextFieldSeqNo = fieldSeqNo;
  }
  onTextStop(event, fieldSeqNo: number) {
    console.log('stopped output:', event);
    this.activeTextFieldSeqNo = fieldSeqNo;
    this.confirmTextField(this.activeTextFieldSeqNo);
  }
  onTextMoving(event, fieldSeqNo: number) {
    this.textMovingOffset.x = event.x;
    this.textMovingOffset.y = event.y;
    //   this.activeTextFieldSeqNo = fieldSeqNo;
  }
  onTextMoveEnd(event, fieldSeqNo: number) {
    this.textEndOffset.x = event.x;
    this.textEndOffset.y = event.y;
    console.log(this.textEndOffset.x + ',' + this.textEndOffset.y);
    //   this.activeTextFieldSeqNo = fieldSeqNo;
  }

  onDateStart(event, fieldSeqNo: number) {
    console.log('started output:', event);
    //   this.activeDateFieldSeqNo = fieldSeqNo;
  }
  onDateStop(event, fieldSeqNo: number) {
    console.log('stopped output:', event);
    this.activeDateFieldSeqNo = fieldSeqNo;
    this.confirmDateField(this.activeDateFieldSeqNo);
  }
  onDateMoving(event, fieldSeqNo: number) {
    this.dateMovingOffset.x = event.x;
    this.dateMovingOffset.y = event.y;
    //   this.activeDateFieldSeqNo = fieldSeqNo;
  }
  onDateMoveEnd(event, fieldSeqNo: number) {
    this.dateEndOffset.x = event.x;
    this.dateEndOffset.y = event.y;
    console.log(this.dateEndOffset.x + ',' + this.dateEndOffset.y);
    //   this.activeDateFieldSeqNo = fieldSeqNo;
  }



  validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: any = 50;
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_DIMENSIONS_PX ||
        event.rectangle.height < MIN_DIMENSIONS_PX)
    ) {
      return false;
    }
    return true;
  }

  onResizeEnd(event: ResizeEvent): void {
    this.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }

  goToEZSignDocumentsView() {
    this.router.navigateByUrl('main/ezsign/senderdocuments');
  }

  editSigners() {
    console.log('edit Signers');
    console.log('tracking id:' + this.ezSignTrackingId);
    const dialogRef = this.dialog.open(AddsignersComponent, {
      width: '1260px', height: '500px'
    });
    dialogRef.componentInstance.addFieldsRef = this;
    dialogRef.componentInstance.setData(this.ezSignTrackingId, 'addfields');
  }

  previewAndSendInvite() {
    console.log('previewAndSendInvite');
    const dialogRef = this.dialog.open(InvitesignersComponent, {
      width: '980px',
    });
    dialogRef.componentInstance.addFieldsComp = this;
    dialogRef.componentInstance.setData(this.ezSignTrackingId, this.title);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // const url = '/main/ezsign/senderdocuments/';
      // this.router.navigateByUrl(url);
    });
  }
}
