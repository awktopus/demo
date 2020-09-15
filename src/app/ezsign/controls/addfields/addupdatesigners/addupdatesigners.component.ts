import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  CompanyType, ESignCPA, CompanyStaff, Company, InfoTrackLocation, Signer, SignerData,
  EzSignField,
  ESignField,
  Offset
} from '../../../../esign/beans/ESignCase'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddfieldsComponent } from '../addfields.component';
import { EzsigndataService } from '../../../service/ezsigndata.service';
import { MatSnackBar } from '@angular/material';
import { AddguestsComponent } from '../addguests/addguests.component';
@Component({
  selector: 'app-addupdatesigners',
  templateUrl: './addupdatesigners.component.html',
  styleUrls: ['./addupdatesigners.component.scss']
})
export class AddupdatesignersComponent implements OnInit {

  showAddFieldSpinner = false;
  showEditFieldSpinner = false;
  operation: string;
  title: string;
  addFieldsRef: AddfieldsComponent;
  primarysigner: CompanyStaff = null;
  clients: CompanyStaff[];
  cacheClients: CompanyStaff[];
  client_var = '';
  removable = true;
  ezSignTrackingId: string;
  fieldRecord: EzSignField;
  receiverNameInput: any;
  fieldType: any;
  fieldDesc: any;
  receiverEmailId: any;
  signerForm: FormGroup = new FormGroup({
    receiverNameControl: new FormControl('', Validators.required),
    receiverEmailIdControl: new FormControl('', Validators.required),
    fieldTypeControl: new FormControl('', Validators.required),
    fieldDescControl: new FormControl('', Validators.required)
  });
  senderId = '';
  @ViewChild('focusField') focusField: ElementRef;

  constructor(private service: EzsigndataService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddupdatesignersComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {

    this.service.getOrganizationEZSignSigners().subscribe(results => {
      console.log('get company staff');
      console.log(results);
      this.senderId = this.service.auth.getUserID();
      this.clients = <CompanyStaff[]>results;
      this.cacheClients = <CompanyStaff[]>results;
      console.log('sender clients');
      console.log(this.clients);
      console.log(this.operation);
      console.log(this.fieldRecord);
      // if (this.operation === 'editfield' && this.fieldRecord) {
      //   console.log('addupdate location ngOnInit()');
      //   console.log(this.operation);
      //   console.log(this.fieldRecord);
      //   let cmpnyStaff = new CompanyStaff();
      //   cmpnyStaff.clientId = this.fieldRecord.receiverId;
      //   cmpnyStaff.emailId = this.fieldRecord.receiverEmailId;
      //   cmpnyStaff.firstName = this.fieldRecord.receiverFirstName;
      //   cmpnyStaff.lastName = this.fieldRecord.receiverLastName;
      //   this.primarysigner = cmpnyStaff;
      //   this.signerForm.controls['receiverEmailIdControl'].setValue(this.fieldRecord.receiverEmailId);
      //   this.signerForm.controls['fieldTypeControl'].setValue(this.fieldRecord.fieldType);
      //   this.signerForm.controls['fieldDescControl'].setValue(this.fieldRecord.labelName);
      //  } else {
      //  }
       this.focusField.nativeElement.focus();
      });

    this.signerForm.controls['receiverNameControl'].valueChanges.subscribe(searchToken => {
      console.log('receiver name search called');
      console.log("searchToken:" + searchToken);
      console.log(this.client_var);
      console.log(typeof searchToken);
      console.log(this.primarysigner);

      if (this.senderId === '') {
        return;
      }
      if (this.primarysigner) {
        return;
      }
      if (searchToken && typeof searchToken !== 'object') {
        if (this.client_var === searchToken.trim()) {
          return;
        } else {
          console.log('primary signer searching...');
          this.clients = [];
          console.log('cache clients');
          console.log(this.cacheClients);
          this.cacheClients.forEach(cc => {
            if ((cc.firstName && cc.firstName.toLowerCase().search(searchToken.toLowerCase()) !== -1) ||
              (cc.lastName && cc.lastName.toLowerCase().search(searchToken.toLowerCase()) !== -1)) {
              this.clients.push(cc);
            }
          });
          console.log(this.clients);
        }
      } else {
        this.clients = <CompanyStaff[]>this.cacheClients;
      }
    });
  }

  setData(operation: string, title: string, fieldRecord: EzSignField, ezSignTrackingId: string) {
    this.operation = operation;
    this.title = title;
    this.ezSignTrackingId = ezSignTrackingId;
    this.fieldRecord = fieldRecord;
  }

  addPrimary(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add primary client' + value);
    if ((value && event.isUserInput && this.clients)) {
      let c: CompanyStaff = null;
      this.clients.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.primarysigner = c;
      this.signerForm.controls['receiverNameControl'].setValue('');
      this.signerForm.controls['receiverEmailIdControl'].setValue(this.primarysigner.emailId);
    }
  }

  removeSinger(): void {
    this.primarysigner = null;
   // this.signerForm.contains['receiverNameControl'].setValue('');
    this.clients = <CompanyStaff[]>this.cacheClients;
  }

  addFieldData() {
    if (!this.primarysigner) {
      this.snackBar.open("Please select a signer", '', { duration: 3000 });
      return ;
    }
    this.showAddFieldSpinner = true;
    console.log('add field data');
    console.log(this.primarysigner);
    let isSender = "N";
    let isSenderSigner = "N";
    if (this.primarysigner.clientId === this.service.auth.getUserID()) {
      isSender = "Y";
      isSenderSigner = "Y";
    }
    // if (typeof this.receiverNameInput === 'undefined') {
    //   this.receiverNameInput = '';
    // }
    let fieldData = new EzSignField();
    fieldData.receiverId = this.primarysigner.clientId;
    fieldData.receiverFirstName = this.primarysigner.firstName;
    fieldData.receiverLastName = this.primarysigner.lastName;
    fieldData.receiverEmailId = this.receiverEmailId;
    fieldData.isGuest = "N";
    fieldData.isELMember = this.primarysigner.isELMember;
    fieldData.isSenderSigner = isSenderSigner;
    fieldData.isSender = isSender;
    fieldData.fieldType = this.signerForm.controls['fieldTypeControl'].value;
    fieldData.labelName = this.signerForm.controls['fieldDescControl'].value;
    let fieldMovingOffset = new Offset();
    fieldMovingOffset.x = 0;
    fieldMovingOffset.y = 0;
    let fieldEndOffset = new Offset;
    fieldEndOffset.x = 0;
    fieldEndOffset.y = 0;
    fieldData.fieldMovingOffset = fieldMovingOffset;
    fieldData.fieldEndOffset = fieldEndOffset;
    this.addFieldsRef.addFieldData(fieldData);
    this.showAddFieldSpinner = false;
    this.cancelPopup();
  }

  // updateFieldData() {
  //   this.showEditFieldSpinner = true;
  //   console.log('update field data');
  //   console.log(this.primarysigner);
  //   let isSender = "N";
  //   let isSenderSigner = "N";
  //   if (this.primarysigner.clientId === this.service.auth.getUserID()) {
  //     isSender = "Y";
  //     isSenderSigner = "Y";
  //   }
  //   let fieldData = new EzSignField();
  //   fieldData.receiverId = this.primarysigner.clientId;
  //   fieldData.receiverFirstName = this.primarysigner.firstName;
  //   fieldData.receiverLastName = this.primarysigner.lastName;
  //   fieldData.receiverEmailId = this.primarysigner.emailId;
  //   fieldData.isSenderSigner = isSenderSigner;
  //   fieldData.isSender = isSender;
  //   fieldData.fieldType = this.signerForm.controls['fieldTypeControl'].value;
  //   fieldData.labelName = this.signerForm.controls['fieldDescControl'].value;
  //   this.addFieldsRef.addFieldData(fieldData);
  //   this.showEditFieldSpinner = false;
  //   this.cancelPopup();
  // }

  selectFieldType(event: any) {
    console.log('select field type selection');
    console.log(event);

    if (event.value === 'signature') {
      this.signerForm.controls['fieldDescControl'].setValue('Sign here');
    } else if (event.value === 'text') {
      this.signerForm.controls['fieldDescControl'].setValue('Text field, e.g. Title Here');
    } else if (event.value === 'date') {
      this.signerForm.controls['fieldDescControl'].setValue('Select date');
    } else if (event.value === 'initial') {
      this.signerForm.controls['fieldDescControl'].setValue('Initial here');
    }
  }

  cancelPopup() {
    this.dialogRef.close();
  }

  addGuestField() {
    console.log('addGuestField:');
    const dialogRef = this.dialog.open(AddguestsComponent, {
      width: '600px', height: '700px'
    });
    dialogRef.componentInstance.addSignersRef = this;
    dialogRef.componentInstance.addFieldsRef = this.addFieldsRef;
    dialogRef.componentInstance.setData("addguest", "New Guests", null, this.ezSignTrackingId);
  }

}
