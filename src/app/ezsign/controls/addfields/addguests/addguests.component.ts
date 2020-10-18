import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  CompanyType, ESignCPA, CompanyStaff, Company, InfoTrackLocation, Signer, SignerData,
  EzSignField,
  ESignField,
  Offset,
  SignerFieldType
} from '../../../../esign/beans/ESignCase'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddfieldsComponent } from '../addfields.component';
import { EzsigndataService } from '../../../service/ezsigndata.service';
import { MatSnackBar } from '@angular/material';
import { AddupdatesignersComponent } from '../addupdatesigners/addupdatesigners.component';

@Component({
  selector: 'app-addguests',
  templateUrl: './addguests.component.html',
  styleUrls: ['./addguests.component.scss']
})
export class AddguestsComponent implements OnInit {
  showAddFieldSpinner = false;
  operation: string;
  title: string;
  addFieldsRef: AddfieldsComponent;
  addSignersRef: AddupdatesignersComponent;
  ezSignTrackingId: string;
  fieldRecord: EzSignField;
  firstName: any;
  lastName: any;
  fieldType: any;
  fieldDesc: any;
  emailIdInput: any;
  receiverEmailId: any;
  guestSignerForm: FormGroup = new FormGroup({
    receiverEmailIdControl: new FormControl('', Validators.required),
    receiverFirstNameControl: new FormControl('', Validators.required),
    receiverLastNameControl: new FormControl(''),
    signHereFieldDescControl: new FormControl(''),
    dateFieldDescControl: new FormControl(''),
    initialFieldDescControl: new FormControl(''),
    titleFieldDescControl: new FormControl('')
  });
  senderId = '';
  guestSigner: CompanyStaff = null;
  guestSigners: CompanyStaff[];
  cacheGuestSigners: CompanyStaff[];
  removable = true;
  isGuestContactsFetched = false;
  guestSigner_var = '';
  isContactToBeSaved = true;
  signHereFieldDesc: any;
  dateFieldDesc: any;
  intialFieldDesc: any;
  titleFieldDesc: any;
  isSignHereChecked = true;
  isDateChecked = true;
  isInitialChecked = true;
  isTitleChecked = false;
  fieldsData: Signer[] = [];

  @ViewChild('focusField') focusField: ElementRef;
  constructor(private service: EzsigndataService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddguestsComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log('Add signers ngOnInit');

    this.guestSignerForm.controls['signHereFieldDescControl'].setValue('Sign here');
    this.guestSignerForm.controls['titleFieldDescControl'].setValue('e.g. Title here');
    this.guestSignerForm.controls['dateFieldDescControl'].setValue('Select date');
    this.guestSignerForm.controls['initialFieldDescControl'].setValue('Initial here');
    this.signHereFieldDesc = "Sign here";
    this.dateFieldDesc = "Select date";
    this.intialFieldDesc = "Initial here";
    this.titleFieldDesc = "e.g. Title here";
    this.isGuestContactsFetched = true;

    this.service.GetOrganizationGuestContacts().subscribe(results => {
      console.log('get organization guest contacts');
      this.guestSigners = <CompanyStaff[]>results;
      this.cacheGuestSigners = <CompanyStaff[]>results;
      console.log(this.guestSigners);
      this.focusField.nativeElement.focus();
      this.isGuestContactsFetched = false
    });

    this.guestSignerForm.controls['receiverEmailIdControl'].valueChanges.subscribe(searchToken => {
      console.log('guest signer email search called');
      console.log("searchToken:" + searchToken);
      console.log(this.guestSigner_var);
      console.log(typeof searchToken);
      console.log(this.guestSigner);
      if (this.guestSigner) {
        return;
      }
      if (searchToken && typeof searchToken !== 'object') {
        if (this.guestSigner_var === searchToken.trim()) {
          return;
        } else {
          console.log('guest signer searching...');
          this.guestSigners = [];
          console.log('cache guest signers');
          console.log(this.cacheGuestSigners);
          this.cacheGuestSigners.forEach(cc => {
            if ((cc.emailId && cc.emailId.toLowerCase().search(searchToken.toLowerCase()) !== -1)) {
              this.guestSigners.push(cc);
            }
          });
          console.log(this.guestSigners);
        }
      } else {
        this.guestSigners = <CompanyStaff[]>this.cacheGuestSigners;
      }
    });
  }

  setData(operation: string, title: string, fieldRecord: EzSignField, ezSignTrackingId: string) {
    this.operation = operation;
    this.title = title;
    this.ezSignTrackingId = ezSignTrackingId;
    this.fieldRecord = fieldRecord;
  }

  addGuestSigner(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add guest signer' + value);
    if ((value && event.isUserInput && this.guestSigners)) {
      let c: CompanyStaff = null;
      this.guestSigners.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.guestSigner = c;
      this.guestSignerForm.controls['receiverFirstNameControl'].setValue(this.guestSigner.firstName);
      this.guestSignerForm.controls['receiverLastNameControl'].setValue(this.guestSigner.lastName);
    }
  }

  removeGuest(): void {
    this.guestSigner = null;
    this.focusField.nativeElement.value = "";
    this.guestSignerForm.controls['receiverFirstNameControl'].setValue('');
    this.guestSignerForm.controls['receiverLastNameControl'].setValue('');
    this.emailIdInput = null;
    this.cacheGuestSigners = <CompanyStaff[]>this.cacheGuestSigners;
  }

  addGuestFieldData() {
    console.log('add guest field data - start');
    console.log(this.guestSigner);
    console.log('email input');
    console.log(this.emailIdInput)
    console.log('first name');
    console.log(this.firstName);
    console.log('last name');
    console.log(this.lastName);
    console.log('is contact to be saved');
    console.log(this.isContactToBeSaved);
    let temailId = "";

    if (this.guestSigner) {

      this.firstName = this.guestSigner.firstName;
      this.lastName = this.guestSigner.lastName;
      temailId = this.guestSigner.emailId;

      if ((typeof temailId === 'undefined'
        || temailId === '' || temailId === null)) {
        this.snackBar.open("Search for a guest email or Enter guest email address", '', { duration: 3000 });
        return;
      }

      if (!this.firstName) {
        this.snackBar.open("Please enter guest first name", '', { duration: 3000 });
        return;
      }

    } else {
      this.firstName = this.guestSignerForm.controls['receiverFirstNameControl'].value;
      this.lastName = this.guestSignerForm.controls['receiverLastNameControl'].value;
      temailId = this.emailIdInput;

      if ((typeof temailId === 'undefined'
        || temailId === '' || temailId === null)) {
        this.snackBar.open("Search for a guest email or Enter guest email address", '', { duration: 3000 });
        return;
      }

      if (!this.firstName) {
        this.snackBar.open("Please enter guest first name", '', { duration: 3000 });
        return;
      }

      if (!this.lastName) {
        this.snackBar.open("Please enter guest last name", '', { duration: 3000 });
        return;
      }
    }

    if (this.isSignHereChecked === false && this.isDateChecked === false
      && this.isInitialChecked === false && this.isTitleChecked === false) {
        this.snackBar.open("Please check field type (Signature, Date, Initial, Text)", '', { duration: 3000 });
        return;
      }

  //   this.showAddFieldSpinner = true;
  //   let isSender = "N";
  //   let isSenderSigner = "N";

  //   let fieldData = new EzSignField();
  //   fieldData.receiverFirstName = this.firstName;
  //   fieldData.receiverLastName = this.lastName;
  //   fieldData.receiverEmailId = temailId;
  //   if (this.guestSigner) {
  //     if (this.guestSigner.isELMember === "Y") {
  //       fieldData.isELMember = "Y";
  //       fieldData.isGuest = "N";
  //     } else {
  //       fieldData.isELMember = "N";
  //       fieldData.isGuest = "Y";
  //     }
  //   } else {
  //     fieldData.isELMember = "N";
  //     fieldData.isGuest = "Y";
  //   }
  //   fieldData.isSenderSigner = isSenderSigner;
  //   fieldData.isSender = isSender;

  //   if (this.guestSigner) {
  //     fieldData.isContactTobeSaved = false;
  //     fieldData.receiverId = this.guestSigner.clientId;
  //   } else {
  //     fieldData.isContactTobeSaved = this.isContactToBeSaved;
  //  }

  //   fieldData.fieldType = this.guestSignerForm.controls['fieldTypeControl'].value;
  //   fieldData.labelName = this.guestSignerForm.controls['fieldDescControl'].value;
  //   let fieldMovingOffset = new Offset();
  //   fieldMovingOffset.x = 0;
  //   fieldMovingOffset.y = 0;
  //   let fieldEndOffset = new Offset;
  //   fieldEndOffset.x = 0;
  //   fieldEndOffset.y = 0;
  //   fieldData.fieldMovingOffset = fieldMovingOffset;
  //   fieldData.fieldEndOffset = fieldEndOffset;
  //   console.log('guest field data');
  //   console.log(fieldData);
  //   this.addFieldsRef.addFieldData(fieldData);
  //   this.showAddFieldSpinner = false;
  //   this.cancelPopup();
  //   this.cancelAddSignersPopup();

   let isSender = "N";
   let isSenderSigner = "N";

    let fieldData = new Signer();
   // fieldData.receiverId = this.primarysigner.clientId;
    fieldData.receiverFirstName = this.firstName;
    fieldData.receiverLastName = this.lastName;
    fieldData.receiverEmailId = this.receiverEmailId;

      if (this.guestSigner) {
      if (this.guestSigner.isELMember === "Y") {
        fieldData.isELMember = "Y";
        fieldData.isGuest = "N";
      } else {
        fieldData.isELMember = "N";
        fieldData.isGuest = "Y";
      }
    } else {
      fieldData.isELMember = "N";
      fieldData.isGuest = "Y";
    }
    fieldData.isSenderSigner = isSenderSigner;
    fieldData.isSender = isSender;

    if (this.guestSigner) {
      fieldData.isContactTobeSaved = false;
      fieldData.receiverId = this.guestSigner.clientId;
    } else {
      fieldData.isContactTobeSaved = this.isContactToBeSaved;
   }

    let fldTypes: SignerFieldType[] = [];
    if (this.isSignHereChecked) {
    let fieldType = new SignerFieldType();
    fieldType.fieldName = "signature";
    fieldType.fieldTypeDesc = this.guestSignerForm.controls['signHereFieldDescControl'].value;
    fieldType.fieldTypeId = 1;
    fldTypes.push(fieldType);
   }

  if (this.isDateChecked) {
    let fieldType = new SignerFieldType();
    fieldType.fieldName = "date";
    fieldType.fieldTypeDesc = this.guestSignerForm.controls['dateFieldDescControl'].value;
    fieldType.fieldTypeId = 3;
    fldTypes.push(fieldType);
    }

  if (this.isInitialChecked) {
    let fieldType = new SignerFieldType();
    fieldType.fieldName = "initial";
    fieldType.fieldTypeDesc = this.guestSignerForm.controls['initialFieldDescControl'].value;
    fieldType.fieldTypeId = 4;
    fldTypes.push(fieldType);
    }

  if (this.isTitleChecked) {
    let fieldType = new SignerFieldType();
    fieldType.fieldName = "title";
    fieldType.fieldTypeDesc = this.guestSignerForm.controls['titleFieldDescControl'].value;
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

  saveAsContact(event) {
    if (event.checked) {
      this.isContactToBeSaved = true;
    } else {
      this.isContactToBeSaved = false;
    }
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

  cancelPopup() {
    this.dialogRef.close();
  }
  cancelAddSignersPopup() {
    this.addSignersRef.cancelPopup();
  }
}
