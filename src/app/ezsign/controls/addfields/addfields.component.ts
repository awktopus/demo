import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelect, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatFormField, MatSnackBar } from '@angular/material';
import {
  ESignCase, ESignDoc, ESignCPA, ESignClient, ClientReminder, Signer,
  EZSignPageImageData, EsignFormField, SignatureField, DateField, TextField, EZSignDocResource, SignerData, EzSignField
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
import { AddupdatesignersComponent } from './addupdatesigners/addupdatesigners.component';
import { EzsignConfirmationDialogComponent } from '../shared/ezsign-confirmation-dialog/ezsign-confirmation-dialog.component';
import { AnyMxRecord } from 'dns';
import { delay } from 'q';
import { AddguestsComponent } from './addguests/addguests.component';
@Component({
  selector: 'app-addfields',
  templateUrl: './addfields.component.html',
  styleUrls: ['./addfields.component.scss']
})
export class AddfieldsComponent implements OnChanges, OnInit {
  public style: object = {};
  ezSignTrackingId: string;
  docId: string;
  status: string;
  pageSeqNo: number;
  pageCount: number;
  isPreviousPageLoading = false;
  isNextPageLoading = false;
  title: string;

  formImageBlobUrl: string;
  ezSignPageImageData: SignerData;
  ezSignFields: EzSignField[] = [];
  isImageDataUrlFetched = false;
  signatureFieldName: string;

  showspinner = false;
  eZSigners: Signer[] = [];

  inBounds = true;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  signerData: SignerData[] = [];
  isFieldsReadyToShow = false;
  displayedColumns: string[] = ['select', 'fieldSeqNo', 'receiverName', 'receiverEmailId',
    'fieldType',
    'fieldDescription', 'delete'];
  @ViewChild('focusSignatureField') focusSignatureField: MatSelect;
  selectedFieldRow: any;
  constructor(private service: EzsigndataService, public dialog: MatDialog,
    private sanitizer: DomSanitizer, private router: Router, private snackBar: MatSnackBar,
    private route: ActivatedRoute) {
  }

  ngOnChanges() {
    console.log('add fields ngOnChanges Event');
  }

  ngOnInit() {
    console.log('add fields ngOnInit event');
    this.route.paramMap.subscribe(para => {
      this.ezSignTrackingId = para.get('trackingId');
      console.log(this.ezSignTrackingId);
      this.signerData = [];
      this.ezSignFields = [];
      this.loadSignerData();
    });
  }
  loadSignerData() {
    this.service.GetSignerData(this.ezSignTrackingId).subscribe(resp => {
      console.log('load signer data:')
      this.ezSignPageImageData = resp;
      console.log(this.ezSignPageImageData);
      console.log('data url');
      this.ezSignPageImageData.dataUrl = this.ezSignPageImageData.dataUrl.substring(1, this.ezSignPageImageData.dataUrl.length - 1)
      this.formImageBlobUrl = this.ezSignPageImageData.dataUrl;
      this.docId = this.ezSignPageImageData.docId;
      this.pageSeqNo = this.ezSignPageImageData.pageSeqNo;
      this.pageCount = this.ezSignPageImageData.pageCount;
      this.title = this.ezSignPageImageData.title;
      this.status = this.ezSignPageImageData.status;
      (async () => {
        // Do something before delay
        console.log('before delay');
        await delay(2000);
        this.isImageDataUrlFetched = true;
        await delay(2000);
        console.log('after delay');
        // Do something after
        if (this.ezSignPageImageData.fields) {
          this.ezSignFields = <EzSignField[]>this.ezSignPageImageData.fields;
          console.log('ez sign fields');
          console.log(this.ezSignFields);
        }
        this.isFieldsReadyToShow = true;
      })();
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  loadEZSignDocPage(docId: string, pageSeqNo: any, actionType: string) {
    this.service.GetPageSignerData(this.ezSignTrackingId, docId, pageSeqNo).subscribe(resp => {
      console.log('Get page signer response:')
      this.ezSignPageImageData = resp;
      console.log(this.ezSignPageImageData);
      this.ezSignPageImageData.dataUrl = this.ezSignPageImageData.dataUrl.substring(1, this.ezSignPageImageData.dataUrl.length - 1)
      this.formImageBlobUrl = this.ezSignPageImageData.dataUrl;
      this.docId = this.ezSignPageImageData.docId;
      this.pageSeqNo = this.ezSignPageImageData.pageSeqNo;
      this.pageCount = this.ezSignPageImageData.pageCount;

      if (this.ezSignPageImageData.fields) {
        this.ezSignFields = this.ezSignPageImageData.fields;
        console.log('ezsign fields');
        console.log(this.ezSignFields);
      } else {
        this.ezSignFields = this.ezSignPageImageData.fields;
      }
      this.isImageDataUrlFetched = true;
      if (actionType === 'previous') {
        if (pageSeqNo === 1) {
          this.pageSeqNo = 1;
        } else {
          this.pageSeqNo = pageSeqNo;
        }
        this.isPreviousPageLoading = false;
      }
      if (actionType === 'next') {
        if (pageSeqNo === this.pageCount) {
          this.pageSeqNo = this.pageCount;
        } else {
          this.pageSeqNo = pageSeqNo;
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

  checkEdge(event) {
    this.edge = event;
    console.log('edge:', event);
  }

  onFieldStart(event, fieldSeqNo: number) {
    console.log('onFieldStart:');
    console.log(event);
    console.log(fieldSeqNo);
    if (this.ezSignFields) {
      this.ezSignFields.forEach(sf => {
        if (sf.fieldSeqNo === fieldSeqNo) {
          sf.isSelected = true;
          // this.fldMovingOffset.x = event.x;
          // this.fldMovingOffset.y = event.y;
        } else {
          sf.isSelected = false;
        }
      });
    }
  }
  onFieldStop(event, fieldSeqNo: number) {
    console.log('onFieldStop:');
    console.log(event);
    console.log(fieldSeqNo);
    //   this.confirmField(this.activeSignatureFieldSeqNo);
  }
  onFieldMoving(event, fieldSeqNo: number) {
    console.log('on Field moving');
    console.log(event);
    console.log(fieldSeqNo);
    if (this.ezSignFields) {
      this.ezSignFields.forEach(sf => {
        if (sf.fieldSeqNo === fieldSeqNo) {
          sf.fieldMovingOffset.x = event.x;
          sf.fieldMovingOffset.y = event.y;
          // this.fldMovingOffset.x = event.x;
          // this.fldMovingOffset.y = event.y;
        }
      });
    }
    //  this.activeSignatureFieldSeqNo = fieldSeqNo;
  }
  onFieldMoveEnd(event, fieldSeqNo: number) {
    console.log('on Field moving end');
    console.log(event);
    console.log(fieldSeqNo);
    if (this.ezSignFields) {
      this.ezSignFields.forEach(sf => {
        if (sf.fieldSeqNo === fieldSeqNo) {
          sf.fieldEndOffset.x = event.x;
          sf.fieldEndOffset.y = event.y;
          // this.fldEndOffset.x = event.x;
          // this.fldEndOffset.y = event.y;
          this.saveField(sf);
        }
      });
    }
    // console.log(this.sigEndOffset.x + ',' + this.sigEndOffset.y);
    //  this.activeSignatureFieldSeqNo = fieldSeqNo;
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
    this.router.navigateByUrl('main/ezsign/ezsignmain');
  }

  previewAndSendInvite() {
    console.log('previewAndSendInvite');
    if (!this.ezSignFields || this.ezSignFields.length === 0) {
      this.snackBar.open("Please add fields and signers", '', { duration: 3000 });
      return;
    }
    const dialogRef = this.dialog.open(InvitesignersComponent, {
      width: '980px',
    });
    dialogRef.componentInstance.addFieldsComp = this;
    dialogRef.componentInstance.setData(this.ezSignTrackingId, this.title, this.status);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  addField() {
    console.log('addField:');
    const dialogRef = this.dialog.open(AddupdatesignersComponent, {
      width: '500px', height: '600px'
    });
    dialogRef.componentInstance.addFieldsRef = this;
    dialogRef.componentInstance.setData("addfield", "Add Field", null, this.ezSignTrackingId);
  }

  addGuestField() {
    console.log('addGuestField:');
    const dialogRef = this.dialog.open(AddguestsComponent, {
      width: '600px', height: '700px'
    });
    dialogRef.componentInstance.addFieldsRef = this;
    dialogRef.componentInstance.setData("addguest", "New Guests", null, this.ezSignTrackingId);
  }
  addFieldData(fieldData: EzSignField) {
    console.log('addFieldData');
    // Step1: save Signer
    const newSignerJson = {
      receiverId: fieldData.receiverId,
      receiverFirstName: fieldData.receiverFirstName,
      receiverLastName: fieldData.receiverLastName,
      receiverEmailId: fieldData.receiverEmailId,
      isSenderSigner: fieldData.isSenderSigner,
      isSender: fieldData.isSender,
      isGuest: fieldData.isGuest,
      isContactTobeSaved: fieldData.isContactTobeSaved
    };
    console.log(newSignerJson);
    this.service.addNewSigner(this.ezSignTrackingId, newSignerJson).subscribe(resp => {
      console.log('add new signer response');
      console.log(resp);
      if (resp) {
        fieldData.receiverId = resp.receiverId;
      }
      console.log('add field - start');
      fieldData.posX = 0;
      fieldData.posY = this.ezSignPageImageData.pageHeight;
      fieldData.height = 18;
      fieldData.width = 140;
      fieldData.showBox = true;
      fieldData.isTagExists = true;
      console.log('add field - end');
      console.log(fieldData);
      this.saveField(fieldData);
    });
  }

  saveField(fieldData: EzSignField) {
    console.log('save signature field - start');
    console.log(fieldData);
    let boxX = fieldData.posX;
    let boxY = fieldData.posY;
    if (fieldData.fieldEndOffset.x < 0) {
      boxX = fieldData.posX + fieldData.fieldEndOffset.x;
    } else {
      boxX = fieldData.posX + fieldData.fieldEndOffset.x;
    }
    if (fieldData.fieldEndOffset.y < 0) {
      boxY = fieldData.posY - fieldData.fieldEndOffset.y;
    } else {
      boxY = fieldData.posY - fieldData.fieldEndOffset.y;
    }
    if (boxX < 0) {
      boxX = 0;
    }
    if (boxY < 0) {
      boxY = 0;
    }
    let fType: number;
    if (fieldData.fieldType === 'signature') {
      fType = 1;
    }
    if (fieldData.fieldType === 'text') {
      fType = 2;
    }
    if (fieldData.fieldType === 'date') {
      fType = 3;
    }
    if (fieldData.fieldType === 'initial') {
      fType = 4;
    }
    const newFieldInfo = {
      fieldSeqNo: fieldData.fieldSeqNo,
      fieldTypeId: fType,
      labelName: fieldData.labelName,
      boxX: Math.round(boxX),
      boxY: Math.round(boxY),
      width: 140,
      height: 18,
      receiverId: fieldData.receiverId,
      status: "Uploaded"
    };
    console.log(newFieldInfo);

    this.service.addFieldToEZSignPage(this.ezSignTrackingId, this.docId,
      this.pageSeqNo, newFieldInfo).subscribe(resp => {
        let ezSignPageTempData: SignerData;
        ezSignPageTempData = resp;
        this.ezSignFields = [];
        if (ezSignPageTempData.fields) {
          this.ezSignFields = ezSignPageTempData.fields;
          console.log('updated fields after save field');
          console.log(this.ezSignFields);
          // this.fldMovingOffset = { x: 0, y: 0 };
          // this.fldEndOffset = { x: 0, y: 0 };
          // this.readyToSendInvite = true;
        }
      });
  }

  open_confirmation_dialog_for_field_deletion(deletedFieldData: any): void {
    const dialogRef = this.dialog.open(EzsignConfirmationDialogComponent, {
      width: '450px', height: '150px',
      data: "Do you confirm the deletion of this EZSign field?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.deleteField(deletedFieldData);
      }
    });
  }

  deleteField(fieldData: EzSignField) {
    console.log('delete field');
    console.log(fieldData);
    let fType: number;
    if (fieldData.fieldType === 'signature') {
      fType = 1;
    }
    if (fieldData.fieldType === 'text') {
      fType = 2;
    }
    if (fieldData.fieldType === 'date') {
      fType = 3;
    }
    if (fieldData.fieldType === 'initial') {
      fType = 4;
    }
    this.service.deleteFieldFromEZSignPage(this.ezSignTrackingId, this.docId,
      this.pageSeqNo, fieldData.fieldSeqNo, fType).subscribe(resp => {
        let ezSignPageTempData: SignerData;
        ezSignPageTempData = resp;
        if (ezSignPageTempData.fields) {
          this.ezSignFields = ezSignPageTempData.fields;
          console.log('updated signature fields');
          console.log(this.ezSignFields);
        } else {
          this.ezSignFields = null;
        }
      });
  }

  selectFieldRecord(event: any, selectedFieldRow: EzSignField) {
    console.log(selectedFieldRow);
    console.log(event);
    //  if (this.ezSignPageImageData.fields) {
    //     this.ezSignFields = <EzSignField[]>this.ezSignPageImageData.fields;
    //     console.log('ez sign fields');
    //     console.log(this.ezSignFields);
    //   }
    if (event) {
      if (!event.checked) {
        if (this.ezSignFields) {
          this.ezSignFields.forEach(fld => {
            fld.isSelected = false;
          });
        }
      } else if (this.ezSignFields) {
        this.ezSignFields.forEach(fld => {
          if (fld.fieldSeqNo === selectedFieldRow.fieldSeqNo) {
            fld.isSelected = true;
          } else {
            fld.isSelected = false;
          }
        });
      }
    }
  }
  editField(fieldData: EzSignField) {
    console.log('update field:');
    const dialogRef = this.dialog.open(AddupdatesignersComponent, {
      width: '500px', height: '600px'
    });
    dialogRef.componentInstance.addFieldsRef = this;
    dialogRef.componentInstance.setData("editfield", "Update Field", fieldData, this.ezSignTrackingId);
  }
}


 // addField(fieldType: string) {
  //   console.log('add field - start');
  //   console.log('fieldType:' + fieldType);

  //   if (fieldType === 'field') {
  //     if (!this.ezSignFields) {
  //       this.ezSignFields = [];
  //     }
  //     let fieldCount = this.signatureFields.length;
  //     fieldCount = fieldCount + 1;
  //     this.activeSignatureFieldSeqNo = fieldCount;
  //     let sigField = new EzSignField();
  //     sigField.fieldSeqNo = fieldCount;
  //     sigField.posX = 0;
  //     sigField.posY = this.ezSignPageImageData.pageHeight;
  //     // sigField.signaturePosY = 0;
  //     sigField.height = 18;
  //     sigField.width = 140;
  //     sigField.showBox = true;
  //     sigField.isTagExists = true;
  //     this.sigFieldSelected = 'signature';
  //     this.textFieldSelected = '';
  //     this.dateFieldSelected = '';
  //     sigField.fieldType = "Signature";
  //     this.ezSignFields.push(sigField);
  //     console.log(sigField);
  //     console.log(this.signatureFields);
  //     this.signatureFieldForm.reset();
  //     console.log('add field - end');
  //   }

  //   if (fieldType === 'signature') {
  //     if (!this.signatureFields) {
  //       this.signatureFields = [];
  //     }
  //     let fieldCount = this.signatureFields.length;
  //     fieldCount = fieldCount + 1;
  //     this.activeSignatureFieldSeqNo = fieldCount;
  //     let sigField = new SignatureField();
  //     sigField.fieldSeqNo = fieldCount;
  //     sigField.signaturePosX = 0;
  //     sigField.signaturePosY = this.ezSignPageImageData.pageHeight;
  //     // sigField.signaturePosY = 0;
  //     sigField.signatureHeight = 18;
  //     sigField.signatureWidth = 140;
  //     sigField.showSignaturebox = true;
  //     sigField.isSignatureTagExists = true;
  //     this.sigFieldSelected = 'signature';
  //     this.textFieldSelected = '';
  //     this.dateFieldSelected = '';
  //     sigField.signatureFieldName = "Signature";
  //     this.signatureFields.push(sigField);
  //     console.log(sigField);
  //     console.log(this.signatureFields);
  //     this.signatureFieldForm.reset();
  //     console.log('add field - end');

  //   } else if (fieldType === 'text') {
  //     console.log('fieldType:' + fieldType);
  //     if (!this.textFields) {
  //       this.textFields = [];
  //     }
  //     let fieldCount = this.textFields.length;
  //     fieldCount = fieldCount + 1;
  //     this.activeTextFieldSeqNo = fieldCount;
  //     let textField = new TextField();
  //     textField.fieldSeqNo = fieldCount;
  //     textField.textPosX = 0;
  //     textField.textPosY = this.ezSignPageImageData.pageHeight;
  //     textField.textHeight = 18;
  //     textField.textWidth = 140;
  //     this.textFieldSelected = 'text';
  //     this.sigFieldSelected = '';
  //     this.dateFieldSelected = '';
  //     textField.showTextbox = true;
  //     textField.isTextTagExists = true;
  //     textField.textFieldName = "Text";
  //     this.textFields.push(textField);
  //     console.log(textField);
  //     console.log(this.textFields);
  //     this.textFieldForm.reset();

  //   } else if (fieldType === 'date') {
  //     console.log('fieldType:' + fieldType);
  //     if (!this.dateFields) {
  //       this.dateFields = [];
  //     }
  //     let fieldCount = this.dateFields.length;
  //     fieldCount = fieldCount + 1;
  //     this.activeDateFieldSeqNo = fieldCount;
  //     let dateField = new DateField();
  //     dateField.fieldSeqNo = fieldCount;
  //     dateField.datePosX = 0;
  //     dateField.datePosY = this.ezSignPageImageData.pageHeight;
  //     dateField.dateHeight = 18;
  //     dateField.dateWidth = 140;
  //     this.dateFieldSelected = 'date';
  //     this.sigFieldSelected = '';
  //     this.textFieldSelected = '';
  //     dateField.showDatebox = true;
  //     dateField.isDateTagExists = true;
  //     dateField.dateFieldName = "Date";
  //     this.dateFields.push(dateField);
  //     console.log(dateField);
  //     console.log(this.dateFields);
  //     this.dateFieldForm.reset();
  //   }
  // }
  // saveSignatureField(signerData: SignerData) {
  //   this.showSigProcess1Spinner = true;
  //   console.log('save signature field - start');
  //   console.log(this.activeSignatureFieldSeqNo);
  //   let boxX;
  //   let boxY;
  //   console.log('signature fields');
  //   console.log(this.signatureFields);
  //   console.log('sig end offset x:');
  //   console.log(this.sigEndOffset.x);
  //   console.log('sig end offset y:');
  //   console.log(this.sigEndOffset.y);
  //   if (this.signatureFields) {
  //     this.signatureFields.forEach(sf => {
  //       if (sf.fieldSeqNo === this.activeSignatureFieldSeqNo) {
  //         if (this.sigEndOffset.x < 0) {
  //           //  sf.signaturePosX =  sf.signaturePosX - this.sigEndOffset.x;
  //           boxX = sf.signaturePosX - this.sigEndOffset.x;
  //         } else {
  //           //  sf.signaturePosX =  sf.signaturePosX + this.sigEndOffset.x;
  //           boxX = sf.signaturePosX + this.sigEndOffset.x;
  //         }
  //         if (this.sigEndOffset.y < 0) {
  //           //  sf.signaturePosY =  sf.signaturePosY + this.sigEndOffset.y;
  //           boxY = sf.signaturePosY + this.sigEndOffset.y;
  //         } else {
  //           //  sf.signaturePosY = sf.signaturePosY - this.sigEndOffset.y;
  //           boxY = sf.signaturePosY - this.sigEndOffset.y;
  //         }
  //       }
  //     });
  //   }
  //   const newFieldInfo = {
  //     fieldSeqNo: this.activeSignatureFieldSeqNo,
  //     fieldTypeId: 1,
  //     labelName: signerData.,
  //     boxX: Math.round(boxX),
  //     boxY: Math.round(boxY),
  //     width: 140,
  //     height: 18,
  //     receiverId: signerData.receiverId,
  //     status: "Uploaded"
  //   };
  //   console.log(newFieldInfo);
  //   this.service.addFieldToEZSignPage(this.ezSignTrackingId, this.docId,
  //     this.pageSeqNo, newFieldInfo).subscribe(resp => {
  //       let ezSignPageTempData: EZSignPageImageData;
  //       ezSignPageTempData = resp;
  //       this.signatureFields = [];
  //       if (ezSignPageTempData.signatureFields) {
  //         this.signatureFields = ezSignPageTempData.signatureFields;
  //         console.log('updated signature fields after save signature field');
  //         console.log(this.signatureFields);
  //         console.log('save signature field - end');
  //         this.readyToSendInvite = true;
  //         this.showSigProcess1Spinner = false;
  //       }
  //     });
  // }

  // removeSignatureField(fieldSeqNo: number) {
  //   this.showSigProcess2Spinner = true;
  //   console.log('removeSignatureField' + fieldSeqNo);
  //   this.service.deleteFieldFromEZSignPage(this.ezSignTrackingId, this.docId,
  //     this.pageSeqNo, this.activeSignatureFieldSeqNo, 1).subscribe(resp => {
  //       let ezSignPageTempData: EZSignPageImageData;
  //       ezSignPageTempData = resp;
  //       if (ezSignPageTempData.signatureFields) {
  //         this.signatureFields = ezSignPageTempData.signatureFields;
  //         console.log('updated signature fields');
  //         console.log(this.signatureFields);
  //         this.sigFieldSelected = '';
  //       } else {
  //         this.signatureFields = null;
  //         this.sigFieldSelected = '';
  //       }
  //       if (this.signatureFields === null ||
  //         (this.signatureFields !== null && this.signatureFields.length === 0)) {
  //         if (this.textFields === null ||
  //           (this.textFields !== null && this.textFields.length === 0)) {
  //           if (this.dateFields === null ||
  //             (this.dateFields !== null && this.dateFields.length === 0)) {
  //             this.readyToSendInvite = false;
  //           }
  //         }
  //       }
  //       this.showSigProcess2Spinner = false;
  //     });
  // }

  // deleteSignatureField() {
  //   console.log('delete signature field - start');
  //   this.removeSignatureField(this.activeSignatureFieldSeqNo);
  //   console.log('delete signature field - end');
  // }

  // confirmSignatureField(fieldSeqNo: number) {
  //   console.log('confirm signature field - start');
  //   console.log('confirm signature field' + fieldSeqNo);
  //   this.sigFieldSelected = 'signature';
  //   this.textFieldSelected = '';
  //   this.dateFieldSelected = '';
  //   // this.activeSignatureFieldSeqNo = fieldSeqNo;
  //   console.log(this.signatureFields);
  //   if (this.signatureFields) {
  //     this.signatureFields.forEach(sf => {
  //       if (sf.fieldSeqNo === fieldSeqNo) {
  //         this.signatureFieldForm.controls['signatureLabelControl'].setValue(sf.labelName);
  //         this.signatureFieldForm.controls['signerControl'].setValue(sf.receiverId);
  //         console.log('confirm signature field - end');
  //       }
  //     })
  //   }
  //   // this.focusSignatureField.focused = true;
  // }

  // onSigStart(event, fieldSeqNo: number) {
  //   // console.log('started output:', event);
  //   // this.activeSignatureFieldSeqNo = fieldSeqNo;
  // }
  // onSigStop(event, fieldSeqNo: number) {
  //   console.log('stopped output:', event);
  //   console.log('active signature field seq no:' + this.activeSignatureFieldSeqNo);
  //   this.activeSignatureFieldSeqNo = fieldSeqNo;
  //   this.confirmSignatureField(this.activeSignatureFieldSeqNo);
  // }
  // onSigMoving(event, fieldSeqNo: number) {
  //   console.log('on Sig moving');
  //   console.log(event);
  //   this.sigMovingOffset.x = event.x;
  //   this.sigMovingOffset.y = event.y;
  //   //  this.activeSignatureFieldSeqNo = fieldSeqNo;
  // }
  // onSigMoveEnd(event, fieldSeqNo: number) {
  //   console.log('on Sig moving end');
  //   console.log(event);
  //   this.sigEndOffset.x = event.x;
  //   this.sigEndOffset.y = event.y;
  //   this.activeSignatureFieldSeqNo = fieldSeqNo;
  //   // console.log(this.sigEndOffset.x + ',' + this.sigEndOffset.y);
  //   //  this.activeSignatureFieldSeqNo = fieldSeqNo;
  // }

  // removeTextField(fieldSeqNo: number) {
  //   this.showTextProcess2Spinner = true;
  //   console.log('removeTextField' + fieldSeqNo);
  //   this.service.deleteFieldFromEZSignPage(this.ezSignTrackingId, this.docId,
  //     this.pageSeqNo, this.activeTextFieldSeqNo, 2).subscribe(resp => {
  //       let ezSignPageTempData: EZSignPageImageData;
  //       ezSignPageTempData = resp;
  //       if (ezSignPageTempData.textFields) {
  //         this.textFields = ezSignPageTempData.textFields;
  //         console.log('updated text fields');
  //         console.log(this.textFields);
  //         this.textFieldSelected = '';
  //       } else {
  //         this.textFields = null;
  //         this.textFieldSelected = '';
  //       }
  //       if (this.signatureFields === null ||
  //         (this.signatureFields !== null && this.signatureFields.length === 0)) {
  //         if (this.textFields === null ||
  //           (this.textFields !== null && this.textFields.length === 0)) {
  //           if (this.dateFields === null ||
  //             (this.dateFields !== null && this.dateFields.length === 0)) {
  //             this.readyToSendInvite = false;
  //           }
  //         }
  //       }
  //       this.showTextProcess2Spinner = false;
  //     });
  // }
  // deleteTextField() {
  //   console.log('delete text field');
  //   this.removeTextField(this.activeTextFieldSeqNo);
  // }
  // confirmTextField(fieldSeqNo: number) {
  //   console.log('confirm text field' + fieldSeqNo);
  //   this.textFieldSelected = 'text';
  //   this.sigFieldSelected = '';
  //   this.dateFieldSelected = '';
  //   this.activeTextFieldSeqNo = fieldSeqNo;
  //   console.log(this.textFields);
  //   if (this.textFields) {
  //     this.textFields.forEach(tf => {
  //       if (tf.fieldSeqNo === fieldSeqNo) {
  //         this.textFieldForm.controls['textLabelControl'].setValue(tf.labelName);
  //         this.textFieldForm.controls['textControl'].setValue(tf.receiverId);
  //       }
  //     })
  //   }
  // }
  // saveTextField(signerData: SignerData) {
  //   this.showTextProcess1Spinner = true;
  //   console.log('save text field');
  //   console.log(this.textFields);
  //   console.log('offset details');
  //   console.log(this.textEndOffset);
  //   console.log(this.activeTextFieldSeqNo);
  //   let boxX;
  //   let boxY;
  //   if (this.textFields) {
  //     this.textFields.forEach(tf => {
  //       if (tf.fieldSeqNo === this.activeTextFieldSeqNo) {
  //         if (this.textEndOffset.x < 0) {
  //           //   tf.textPosX = tf.textPosX - this.textEndOffset.x;
  //           boxX = tf.textPosX - this.textEndOffset.x;
  //         } else {
  //           //   tf.textPosX = tf.textPosX + this.textEndOffset.x;
  //           boxX = tf.textPosX + this.textEndOffset.x;
  //         }
  //         if (this.textEndOffset.y < 0) {
  //           //   tf.textPosY = tf.textPosY + this.textEndOffset.y;
  //           boxY = tf.textPosY + this.textEndOffset.y;
  //         } else {
  //           //   tf.textPosY = tf.textPosY - this.textEndOffset.y;
  //           boxY = tf.textPosY - this.textEndOffset.y;
  //         }
  //       }
  //     });
  //   }
  //   const newFieldInfo = {
  //     fieldSeqNo: this.activeTextFieldSeqNo,
  //     fieldTypeId: 2,
  //     labelName: signerData.fieldDescription,
  //     boxX: Math.round(boxX),
  //     boxY: Math.round(boxY),
  //     width: 140,
  //     height: 18,
  //     receiverId: signerData.fieldDescription,
  //     status: "Uploaded"
  //   };
  //   console.log(newFieldInfo);
  //   this.service.addFieldToEZSignPage(this.ezSignTrackingId, this.docId,
  //     this.pageSeqNo, newFieldInfo).subscribe(resp => {
  //       let ezSignPageTempData: EZSignPageImageData;
  //       ezSignPageTempData = resp;
  //       if (ezSignPageTempData.textFields) {
  //         this.textFields = ezSignPageTempData.textFields;
  //         console.log('updated text fields after save text field');
  //         console.log(this.textFields);
  //         this.readyToSendInvite = true;
  //         this.showTextProcess1Spinner = false;
  //       }
  //     });
  // }

  // onTextStart(event, fieldSeqNo: number) {
  //   console.log('on text start output:', event);
  //   // this.activeTextFieldSeqNo = fieldSeqNo;
  // }
  // onTextStop(event, fieldSeqNo: number) {
  //   console.log('on text stop output:', event);
  //   this.activeTextFieldSeqNo = fieldSeqNo;
  //   this.confirmTextField(this.activeTextFieldSeqNo);
  // }
  // onTextMoving(event, fieldSeqNo: number) {
  //   this.textMovingOffset.x = event.x;
  //   this.textMovingOffset.y = event.y;
  // }
  // onTextMoveEnd(event, fieldSeqNo: number) {
  //   console.log('on text move end');
  //   console.log(event);
  //   console.log(fieldSeqNo);
  //   this.textEndOffset.x = event.x;
  //   this.textEndOffset.y = event.y;
  //   this.activeTextFieldSeqNo = fieldSeqNo;
  //   console.log(this.textEndOffset.x + ',' + this.textEndOffset.y);
  // }


  // removeDateField(fieldSeqNo: number) {
  //   this.showDateProcess2Spinner = true;
  //   console.log('removeDateField' + fieldSeqNo);
  //   this.service.deleteFieldFromEZSignPage(this.ezSignTrackingId, this.docId,
  //     this.pageSeqNo, this.activeDateFieldSeqNo, 3).subscribe(resp => {
  //       let ezSignPageTempData: EZSignPageImageData;
  //       ezSignPageTempData = resp;
  //       if (ezSignPageTempData.dateFields) {
  //         this.dateFields = ezSignPageTempData.dateFields;
  //         console.log('updated date fields');
  //         console.log(this.dateFields);
  //         this.dateFieldSelected = '';
  //       } else {
  //         this.dateFields = null;
  //         this.dateFieldSelected = '';
  //       }
  //       if (this.signatureFields === null ||
  //         (this.signatureFields !== null && this.signatureFields.length === 0)) {
  //         if (this.textFields === null ||
  //           (this.textFields !== null && this.textFields.length === 0)) {
  //           if (this.dateFields === null ||
  //             (this.dateFields !== null && this.dateFields.length === 0)) {
  //             this.readyToSendInvite = false;
  //           }
  //         }
  //       }
  //       this.showDateProcess2Spinner = false;
  //     });
  // }
  // deleteDateField() {
  //   console.log('delete date field');
  //   this.removeDateField(this.activeDateFieldSeqNo);
  // }
  // confirmDateField(fieldSeqNo: number) {
  //   console.log('confirm date field' + fieldSeqNo);
  //   this.dateFieldSelected = 'date';
  //   this.sigFieldSelected = '';
  //   this.textFieldSelected = '';
  //   this.activeDateFieldSeqNo = fieldSeqNo;
  //   console.log(this.dateFields);
  //   if (this.dateFields) {
  //     this.dateFields.forEach(df => {
  //       if (df.fieldSeqNo === fieldSeqNo) {
  //         this.dateFieldForm.controls['dateLabelControl'].setValue(df.labelName);
  //         this.dateFieldForm.controls['dateControl'].setValue(df.receiverId);
  //       }
  //     })
  //   }
  // }
  // saveDateField(signerData: SignerData) {
  //   this.showDateProcess1Spinner = true;
  //   console.log('save date field');
  //   console.log(this.activeDateFieldSeqNo);
  //   console.log('date fields');
  //   console.log(this.dateFields);
  //   let boxX;
  //   let boxY;
  //   if (this.dateFields) {
  //     this.dateFields.forEach(df => {
  //       if (df.fieldSeqNo === this.activeDateFieldSeqNo) {
  //         if (this.dateEndOffset.x < 0) {
  //           // df.datePosX = df.datePosX - this.dateEndOffset.x;
  //           boxX = df.datePosX - this.dateEndOffset.x;
  //         } else {
  //           // df.datePosX = df.datePosX + this.dateEndOffset.x;
  //           boxX = df.datePosX + this.dateEndOffset.x;
  //         }
  //         if (this.dateEndOffset.y < 0) {
  //           // df.datePosY = df.datePosY + this.dateEndOffset.y;
  //           boxY = df.datePosY + this.dateEndOffset.y;
  //         } else {
  //           //  df.datePosY = df.datePosY - this.dateEndOffset.y;
  //           boxY = df.datePosY - this.dateEndOffset.y;
  //         }
  //       }
  //     });
  //   }
  //   const newFieldInfo = {
  //     fieldSeqNo: this.activeDateFieldSeqNo,
  //     fieldTypeId: 3,
  //     labelName: signerData.fieldDescription,
  //     boxX: Math.round(boxX),
  //     boxY: Math.round(boxY),
  //     width: 140,
  //     height: 18,
  //     receiverId: signerData.fieldDescription,
  //     status: "Uploaded"
  //   };
  //   console.log(newFieldInfo);
  //   this.service.addFieldToEZSignPage(this.ezSignTrackingId, this.docId,
  //     this.pageSeqNo, newFieldInfo).subscribe(resp => {
  //       let ezSignPageTempData: EZSignPageImageData;
  //       ezSignPageTempData = resp;
  //       if (ezSignPageTempData.dateFields) {
  //         this.dateFields = ezSignPageTempData.dateFields;
  //         console.log('updated date fields after save date field');
  //         console.log(this.dateFields);
  //         this.readyToSendInvite = true;
  //         this.showDateProcess1Spinner = false;
  //       }
  //     });
  // }
  // onDateStart(event, fieldSeqNo: number) {
  //   console.log('started output:', event);
  //   //   this.activeDateFieldSeqNo = fieldSeqNo;
  // }
  // onDateStop(event, fieldSeqNo: number) {
  //   console.log('stopped output:', event);
  //   this.activeDateFieldSeqNo = fieldSeqNo;
  //   this.confirmDateField(this.activeDateFieldSeqNo);
  // }
  // onDateMoving(event, fieldSeqNo: number) {
  //   this.dateMovingOffset.x = event.x;
  //   this.dateMovingOffset.y = event.y;
  //   //   this.activeDateFieldSeqNo = fieldSeqNo;
  // }
  // onDateMoveEnd(event, fieldSeqNo: number) {
  //   this.dateEndOffset.x = event.x;
  //   this.dateEndOffset.y = event.y;
  //   this.activeDateFieldSeqNo = fieldSeqNo;
  //   console.log(this.dateEndOffset.x + ',' + this.dateEndOffset.y);
  //   //   this.activeDateFieldSeqNo = fieldSeqNo;
  // }
    // confirmField(fieldSeqNo: number) {
  //   console.log('confirm signature field - start');
  //   console.log('confirm signature field' + fieldSeqNo);
  //   this.sigFieldSelected = 'signature';
  //   this.textFieldSelected = '';
  //   this.dateFieldSelected = '';
  //   // this.activeSignatureFieldSeqNo = fieldSeqNo;
  //   console.log(this.signatureFields);
  //   if (this.signatureFields) {
  //     this.signatureFields.forEach(sf => {
  //       if (sf.fieldSeqNo === fieldSeqNo) {
  //         this.signatureFieldForm.controls['signatureLabelControl'].setValue(sf.labelName);
  //         this.signatureFieldForm.controls['signerControl'].setValue(sf.receiverId);
  //         console.log('confirm signature field - end');
  //       }
  //     })
  //   }
  //   // this.focusSignatureField.focused = true;
  // }
