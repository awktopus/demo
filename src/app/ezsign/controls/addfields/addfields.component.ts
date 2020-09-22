import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelect, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatFormField, MatSnackBar } from '@angular/material';
import {
  ESignCase, ESignDoc, ESignCPA, ESignClient, ClientReminder, Signer,
  EZSignPageImageData, EsignFormField, SignatureField, DateField, TextField, EZSignDocResource, SignerData, EzSignField, CompanyStaff
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
  prevSelectedSigner: CompanyStaff = null;
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
          this.set_previously_selected_signer(this.ezSignFields);
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
      this.set_previously_selected_signer(this.ezSignFields);
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
      this.snackBar.open("Please add signer and field", '', { duration: 3000 });
      return;
    }
    const url = '/main/ezsign/invite/' + this.ezSignTrackingId;
    this.router.navigateByUrl(url);
  }

  addField() {
    console.log('addField:');
    const dialogRef = this.dialog.open(AddupdatesignersComponent, {
      width: '500px', height: '600px'
    });
    dialogRef.componentInstance.addFieldsRef = this;
    dialogRef.componentInstance.setData("addfield", "Add Signer", null,
    this.ezSignTrackingId, null);
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
      isContactTobeSaved: fieldData.isContactTobeSaved,
      isELMember: fieldData.isELMember
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
          this.set_previously_selected_signer(this.ezSignFields);
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
          this.set_previously_selected_signer(this.ezSignFields);
        } else {
          this.ezSignFields = null;
          this.set_previously_selected_signer(this.ezSignFields);
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

  set_previously_selected_signer(ezSignFields: EzSignField[]) {
    if (ezSignFields) {
    this.ezSignFields.forEach(sf => {
      this.prevSelectedSigner = new CompanyStaff();
        this.prevSelectedSigner.clientId = sf.receiverId;
        this.prevSelectedSigner.emailId = sf.receiverEmailId;
        this.prevSelectedSigner.firstName = sf.receiverFirstName;
        this.prevSelectedSigner.lastName = sf.receiverLastName;
        this.prevSelectedSigner.isELMember = sf.isELMember;
    });
  } else {
    this.prevSelectedSigner = null;
  }
  }
}
