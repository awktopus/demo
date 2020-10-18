import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {
  CompanyType, ESignCPA, CompanyStaff, Company, InfoTrackLocation, Signer, SignerData,
  EzSignField,
  ESignField,
  Offset,
  SignerFieldType,
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
  signHereFieldDesc: any;
  dateFieldDesc: any;
  intialFieldDesc: any;
  titleFieldDesc: any;
  receiverEmailId: any;
  isSignHereChecked = true;
  isDateChecked = true;
  isInitialChecked = true;
  isTitleChecked = false;
  fieldsData: Signer[] = [];

  signerForm: FormGroup = new FormGroup({
    receiverNameControl: new FormControl('', Validators.required),
    receiverEmailIdControl: new FormControl('', Validators.required),
    signHereFieldDescControl: new FormControl(''),
    dateFieldDescControl: new FormControl(''),
    initialFieldDescControl: new FormControl(''),
    titleFieldDescControl: new FormControl('')
  });
  senderId = '';
  @ViewChild('focusField') focusField: ElementRef;
  @ViewChild('focusField2') focusField2: ElementRef;

  constructor(private service: EzsigndataService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddupdatesignersComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {

  this.signerForm.controls['signHereFieldDescControl'].setValue('Sign here');
  this.signerForm.controls['titleFieldDescControl'].setValue('e.g. Title here');
  this.signerForm.controls['dateFieldDescControl'].setValue('Select date');
  this.signerForm.controls['initialFieldDescControl'].setValue('Initial here');
  this.signHereFieldDesc = "Sign here";
  this.dateFieldDesc = "Select date";
  this.intialFieldDesc = "Initial here";
  this.titleFieldDesc = "e.g. Title here";

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
      if (this.primarysigner) {
        this.signerForm.controls['receiverEmailIdControl'].setValue(this.primarysigner.emailId);
     //   this.signerForm.controls['receiverNameControl'].setValue('');
      } else {
      this.focusField.nativeElement.focus();
    }
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

  setData(operation: string, title: string, fieldRecord: EzSignField,
    ezSignTrackingId: string, prevSelectedSigner: CompanyStaff) {
    this.operation = operation;
    this.title = title;
    this.ezSignTrackingId = ezSignTrackingId;
    this.fieldRecord = fieldRecord;
    this.primarysigner = prevSelectedSigner;
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
    if (this.isSignHereChecked === false && this.isDateChecked === false
      && this.isInitialChecked === false && this.isTitleChecked === false) {
        this.snackBar.open("Please check field type (Signature, Date, Initial, Text)", '', { duration: 3000 });
        return;
      }
    this.showAddFieldSpinner = true;
    console.log('add signer field type data from popup');
    console.log(this.primarysigner);
    let isSender = "N";
    let isSenderSigner = "N";
    if (this.primarysigner.clientId === this.service.auth.getUserID()) {
      isSender = "Y";
      isSenderSigner = "Y";
    }
    let fieldData = new Signer();
    fieldData.receiverId = this.primarysigner.clientId;
    fieldData.receiverFirstName = this.primarysigner.firstName;
    fieldData.receiverLastName = this.primarysigner.lastName;
    fieldData.receiverEmailId = this.receiverEmailId;
    fieldData.isGuest = "N";
    fieldData.isELMember = this.primarysigner.isELMember;
    fieldData.isSenderSigner = isSenderSigner;
    fieldData.isSender = isSender;
    fieldData.isContactTobeSaved = false;
    let fldTypes: SignerFieldType[] = [];
    if (this.isSignHereChecked) {
    let fieldType = new SignerFieldType();
    fieldType.fieldName = "signature";
    fieldType.fieldTypeDesc = this.signerForm.controls['signHereFieldDescControl'].value;
    fieldType.fieldTypeId = 1;
    fldTypes.push(fieldType);
   }

  if (this.isDateChecked) {
    let fieldType = new SignerFieldType();
    fieldType.fieldName = "date";
    fieldType.fieldTypeDesc = this.signerForm.controls['dateFieldDescControl'].value;
    fieldType.fieldTypeId = 3;
    fldTypes.push(fieldType);
    }

  if (this.isInitialChecked) {
    let fieldType = new SignerFieldType();
    fieldType.fieldName = "initial";
    fieldType.fieldTypeDesc = this.signerForm.controls['initialFieldDescControl'].value;
    fieldType.fieldTypeId = 4;
    fldTypes.push(fieldType);
    }

  if (this.isTitleChecked) {
    let fieldType = new SignerFieldType();
    fieldType.fieldName = "title";
    fieldType.fieldTypeDesc = this.signerForm.controls['titleFieldDescControl'].value;
    fieldType.fieldTypeId = 2;
    fldTypes.push(fieldType);
  }
  fieldData.fieldTypes = fldTypes;
  this.fieldsData.push(fieldData);
  console.log(this.fieldsData);
    this.addFieldsRef.add_signer_master_fields(this.fieldsData);
      this.showAddFieldSpinner = false;
      this.cancelPopup();
  }

  checkSignature(event: any) {
    console.log('checkSignature');
    console.log(event);
    this.isSignHereChecked = event.checked;
  }

  checkDate(event: any) {
    console.log('checkDate');
    console.log(event);
    this.isDateChecked = event.checked;
  }

  checkInitial(event: any) {
    console.log('checkInitial');
    console.log(event);
    this.isInitialChecked = event.checked;
  }

  checkText(event: any) {
    console.log('checkText');
    console.log(event);
    this.isTitleChecked = event.checked;
  }

  // selectFieldType(event: any) {
  //   console.log('select field type selection');
  //   console.log(event);

  //   if (event.value === 'signature') {
  //     this.signerForm.controls['fieldDescControl'].setValue('Sign here');
  //   } else if (event.value === 'text') {
  //     this.signerForm.controls['fieldDescControl'].setValue('Text field, e.g. Title Here');
  //   } else if (event.value === 'date') {
  //     this.signerForm.controls['fieldDescControl'].setValue('Select date');
  //   } else if (event.value === 'initial') {
 //     this.signerForm.controls['fieldDescControl'].setValue('Initial here');
  //   }
  // }

  cancelPopup() {
    this.dialogRef.close();
  }

  addGuestField() {
    console.log('addGuestField:');
    const dialogRef = this.dialog.open(AddguestsComponent, {
      width: '600px', height: '850px'
    });
    dialogRef.componentInstance.addSignersRef = this;
    dialogRef.componentInstance.addFieldsRef = this.addFieldsRef;
    dialogRef.componentInstance.setData("addguest", "New Guests", null, this.ezSignTrackingId);
  }

}
