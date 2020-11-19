import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelect, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatFormField, MatSnackBar } from '@angular/material';
import {
  ESignCase, ESignDoc, ESignCPA, ESignClient, ClientReminder, Signer,
  EZSignPageImageData, EsignFormField, SignatureField, DateField, TextField, EZSignDocResource,
  SignerData,
  EzSignField, CompanyStaff, EzSignerFieldType, Offset
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
import { Observable } from 'rxjs';
import { PdfViewerModule, PdfViewerComponent } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-addfields',
  templateUrl: './addfields.component.html',
  styleUrls: ['./addfields.component.scss']
})
export class AddfieldsComponent implements  OnInit {
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
  ezSignSignerFieldTypes: EzSignerFieldType[] = [];
  isImageDataUrlFetched = false;
  signatureFieldName: string;
  mycase: any = {};
  showspinner = false;
  eZSigners: Signer[] = [];
  pdfUrl: any = null;
  inBounds = true;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  pdfview: any = {};
  signerData: SignerData[] = [];
  isFieldsReadyToShow = false;
  displayedColumns: string[] = ['type', 'receiverName', 'receiverEmailId', 'delete'];
  @ViewChild('focusSignatureField') focusSignatureField: MatSelect;
  selectedFieldRow: any;
  prevSelectedSigner: CompanyStaff = null;
  constructor(private service: EzsigndataService, public dialog: MatDialog,
    private sanitizer: DomSanitizer, private router: Router, private snackBar: MatSnackBar,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log('add fields ngOnInit event');
    this.route.paramMap.subscribe(para => {
      this.ezSignTrackingId = para.get('trackingId');
      console.log(this.ezSignTrackingId);
      this.signerData = [];
      this.ezSignFields = [];
      this.ezSignSignerFieldTypes = [];
      this.mycase = this.service.getCacheData("sendercase");
      console.log(this.mycase);
      this.pageSeqNo = this.mycase.eZSignDocPages[0].pageSeqNo;
      this.loadSignerData();
    });
  }

  displayPDFDocPage(docId, seq, mergeFlag) {
    let url = this.service.auth.baseurl + '/EZSign/document/' + docId + "/page/" + seq;
    console.log(url);
    if (mergeFlag === 'Y') {
      url = url + '/mergedform';
    }

    this.service.getPDFBlob(url).subscribe(resp => {
      console.log('got data back!!');
      const file = new Blob([<any>resp], {type: 'application/pdf'});
      const fileURL = URL.createObjectURL(file);
      this.pdfUrl = fileURL;
    });
  }

  pageRendered(eve) {
    console.log(eve);
    this.pdfview = {isReady: true, width: eve.source.div.clientWidth, height: eve.source.div.clientHeight, scale:
      eve.source.viewport.scale, offsetLeft: eve.source.div.offsetLeft, offsetTop: eve.source.div.offsetTop};
    console.log(this.pdfview);
    this.adjustview();
  }

  adjustfield(fd) {
    if (this.pdfview && this.pdfview.isReady) {
      (<any>fd).adjust_posX = fd.posX * this.pdfview.scale + this.pdfview.offsetLeft;
      (<any>fd).adjust_posY = fd.posY * this.pdfview.scale + this.pdfview.offsetTop;
    } else {
        (<any>fd).adjust_posX = fd.posX;
        (<any>fd).adjust_posY = fd.posY;
    }
  }
  adjustview() {
      console.log("adjust view called");
      if (this.ezSignFields) {
        if (this.pdfview && this.pdfview.isReady) {
          this.ezSignFields.forEach( fd => {
            (<any>fd).adjust_posX = fd.posX * this.pdfview.scale + this.pdfview.offsetLeft;
            (<any>fd).adjust_posY = fd.posY * this.pdfview.scale + this.pdfview.offsetTop;
        });
        } else {
          console.log("view not initialized yet");
          this.ezSignFields.forEach( fd => {
              (<any>fd).adjust_posX = fd.posX;
              (<any>fd).adjust_posY = fd.posY;
          });
        }
      }
  }

  loadSignerData() {
    this.service.GetSignerData(this.ezSignTrackingId).subscribe(resp => {
      console.log('load signer data:')
      this.ezSignPageImageData = resp;
      console.log(this.ezSignPageImageData);
      console.log('data url');
      // this.ezSignPageImageData.dataUrl = this.ezSignPageImageData.dataUrl.substring(1, this.ezSignPageImageData.dataUrl.length - 1)
     // this.formImageBlobUrl = this.ezSignPageImageData.dataUrl;
      this.docId = this.ezSignPageImageData.docId;
      this.pageSeqNo = this.ezSignPageImageData.pageSeqNo;
      this.pageCount = this.ezSignPageImageData.pageCount;
      this.title = this.ezSignPageImageData.title;
      this.status = this.ezSignPageImageData.status;
      (async () => {
        // Do something before delay
        console.log('before delay');
        await delay(1000);
        this.isImageDataUrlFetched = true;
        await delay(1000);
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

    this.service.getEZSignSigners(this.ezSignTrackingId).subscribe(signers => {
      console.log('Get ezsign signers');
      console.log(signers);
      if (signers) {
        signers.forEach(element => {
          this.add_ezsigner_field_type(element);
        });
      } else {
        this.ezSignSignerFieldTypes = [];
      }
    });
    this.displayPDFDocPage(this.mycase.docId, this.pageSeqNo, "N");
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  loadEZSignDocPage(docId: string, pageSeqNo: any, actionType: string) {
    this.displayPDFDocPage(this.docId, pageSeqNo, "N");
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
    if (this.status !== "Uploaded") {
      console.log('ezsign status is not uploaded status..you can not change field location ');
      return;
    }
    console.log('on Field moving end');
    console.log(event);
    console.log(fieldSeqNo);
    if (this.ezSignFields) {
      this.ezSignFields.forEach(sf => {
        if (sf.fieldSeqNo === fieldSeqNo) {
          sf.fieldEndOffset.x = event.x;
          sf.fieldEndOffset.y = event.y;
          // this.fldEndOffset.x = event.x;
          // this.fldEndOffset.y = event.
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
      width: '550px', height: '750px'
    });
    dialogRef.componentInstance.addFieldsRef = this;
    dialogRef.componentInstance.setData("addfield", "Add Signer", null,
      this.ezSignTrackingId, null);
  }

  addFieldData(fieldData: EzSignField) {
    console.log('addFieldData');
      fieldData.posX = 0;
      fieldData.posY = this.ezSignPageImageData.pageHeight;
      fieldData.height = 18;
      fieldData.width = 140;
      fieldData.showBox = true;
      fieldData.isTagExists = true;
      console.log('add field - end');
      console.log(fieldData);
      this.adjustfield(fieldData);
      this.saveField(fieldData);
  }

  add_signer_master_fields(fieldsData: Signer[]) {
    console.log('add signer and master fields');
    fieldsData.forEach(fieldData => {
    this.service.addNewSigner(this.ezSignTrackingId, fieldData).subscribe(signers => {
        console.log('add new signer type response');
        console.log(signers);
        this.ezSignSignerFieldTypes = [];
        if (signers) {
            signers.forEach(element => {
              this.add_ezsigner_field_type(element);
            });
          } else {
            this.ezSignSignerFieldTypes = [];
          }
      });
    });
  }

  add_ezsigner_field_type(signerData: Signer) {
    if (signerData) {
      if (signerData.fieldTypes) {
        signerData.fieldTypes.forEach(fy => {
          let signerTypeData = new EzSignerFieldType();
          signerTypeData.fieldName = fy.fieldName;
          signerTypeData.fieldTypeDesc = fy.fieldTypeDesc;
          signerTypeData.fieldTypeId = fy.fieldTypeId;
          signerTypeData.isChecked = signerData.isChecked;
          signerTypeData.isContactTobeSaved = signerData.isContactTobeSaved;
          signerTypeData.isELMember = signerData.isELMember;
          signerTypeData.isEmailReminderScheduled = signerData.isEmailReminderScheduled;
          signerTypeData.isGuest = signerData.isGuest;
          signerTypeData.isSender = signerData.isSender;
          signerTypeData.isSenderSigner = signerData.isSenderSigner;
          signerTypeData.receiverEmailId = signerData.receiverEmailId;
          if (signerData.receiverFirstName === null) {
            signerTypeData.receiverFirstName = "";
          } else {
            signerTypeData.receiverFirstName = signerData.receiverFirstName;
          }

          if (signerData.receiverLastName === null) {
            signerTypeData.receiverLastName = "";
          } else {
            signerTypeData.receiverLastName = signerData.receiverLastName;
          }
          signerTypeData.receiverId = signerData.receiverId;
          signerTypeData.receiverFullName = signerData.receiverFullName;
          signerTypeData.status = signerData.status;
          this.ezSignSignerFieldTypes.push(signerTypeData);
          console.log('added signer master field');
          console.log(this.ezSignSignerFieldTypes);
        });
      }
    }
  }

  dropField(selectedFieldRow: EzSignerFieldType) {
    console.log('drop field');
    console.log(selectedFieldRow);
    let fieldData = new EzSignField();
    if (this.ezSignFields) {
      fieldData.fieldSeqNo = this.ezSignFields.length + 1;
    } else {
    fieldData.fieldSeqNo = 1;
  }
    fieldData.fieldType = selectedFieldRow.fieldName;
    fieldData.receiverId = selectedFieldRow.receiverId;
    fieldData.receiverFirstName = selectedFieldRow.receiverFirstName;
    fieldData.receiverLastName = selectedFieldRow.receiverLastName;
    fieldData.receiverEmailId = selectedFieldRow.receiverEmailId;
    fieldData.isGuest = selectedFieldRow.isGuest;
    fieldData.isELMember = selectedFieldRow.isELMember;
    fieldData.labelName = selectedFieldRow.fieldTypeDesc;
    let fieldMovingOffset = new Offset();
    fieldMovingOffset.x = 0;
    fieldMovingOffset.y = 0;
    let fieldEndOffset = new Offset;
    fieldEndOffset.x = 0;
    fieldEndOffset.y = 0;
    fieldData.fieldMovingOffset = fieldMovingOffset;
    fieldData.fieldEndOffset = fieldEndOffset;
    this.addFieldData(fieldData);
   }

  saveField(fieldData: EzSignField) {
    console.log('save signature field - start');
    console.log(fieldData);
    let fd: any = fieldData;
    let boxX = fd.adjust_posX;
    let boxY = fd.adjust_posY;
    if (fd.fieldEndOffset.x ) {
      boxX = fd.adjust_posX + fd.fieldEndOffset.x;
    } else {
      boxX = fd.adjust_posX + fd.fieldEndOffset.x;
    }
    if (fd.fieldEndOffset.y) {
      boxY = fd.adjust_posY - fd.fieldEndOffset.y;
    } else {
      boxY = fd.adjust_posY - fd.fieldEndOffset.y;
    }
    // now pdfview scaling and offset correction
    boxX = (boxX - this.pdfview.offsetLeft) / this.pdfview.scale;
    boxY = (boxY - this.pdfview.offsetTop) / this.pdfview.scale;

    if (boxX < 0) {
      boxX = 0;
    }
    if (boxY < 0) {
      boxY = 0;
    }
    let fType: number;
    if (fieldData.fieldType.toLowerCase() === 'signature') {
      fType = 1;
    }
    if (fieldData.fieldType.toLowerCase() === 'text') {
      fType = 2;
    }
    if (fieldData.fieldType.toLowerCase() === 'date') {
      fType = 3;
    }
    if (fieldData.fieldType.toLowerCase() === 'initial') {
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
        this.deleteSignerField(deletedFieldData);
      }
    });
  }

  deleteSignerField(fieldData: EzSignField) {
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


  open_confirmation_dialog_for_signer_fieldtype_deletion(deletedFieldData: any): void {
    const dialogRef = this.dialog.open(EzsignConfirmationDialogComponent, {
      width: '450px', height: '200px',
      data: "Do you confirm the deletion of this EZsigner field type and corresponding page fields?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.delete_signer_fieldtype(deletedFieldData);
      }
    });
  }

  delete_signer_fieldtype(fieldData: EzSignerFieldType) {
    console.log('delete_signer_fieldtype');
    console.log(fieldData);
    let fType: number;
    if (fieldData.fieldName.toLowerCase() === 'signature') {
      fType = 1;
    }
    if (fieldData.fieldName.toLowerCase() === 'text') {
      fType = 2;
    }
    if (fieldData.fieldName.toLowerCase() === 'date') {
      fType = 3;
    }
    if (fieldData.fieldName.toLowerCase() === 'initial') {
      fType = 4;
    }
    this.service.deleteSignerFieldType(this.ezSignTrackingId, fieldData.receiverId, fType).subscribe(signers => {
      if (signers) {
        this.ezSignSignerFieldTypes = [];
        signers.forEach(element => {
          this.add_ezsigner_field_type(element);
        });
      } else {
        this.ezSignSignerFieldTypes = [];
      }
      this.ezSignFields.forEach(fld => {
        if (fld.receiverId === fieldData.receiverId && fld.fieldType === fieldData.fieldName.toLowerCase()) {
          const index = this.ezSignFields.indexOf(fld, 0);
          if (index > -1) {
            this.ezSignFields.splice(index, 1);
         }
        }
      });
      console.log('modified ezsign fields');
      console.log(this.ezSignFields);
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
    // if (ezSignFields) {
    //   this.ezSignFields.forEach(sf => {
    //     this.prevSelectedSigner = new CompanyStaff();
    //     this.prevSelectedSigner.clientId = sf.receiverId;
    //     this.prevSelectedSigner.emailId = sf.receiverEmailId;
    //     this.prevSelectedSigner.firstName = sf.receiverFirstName;
    //     this.prevSelectedSigner.lastName = sf.receiverLastName;
    //     this.prevSelectedSigner.isELMember = sf.isELMember;
    //   });
    // } else {
    //   this.prevSelectedSigner = null;
    // }
    this.adjustview();
  }

}
