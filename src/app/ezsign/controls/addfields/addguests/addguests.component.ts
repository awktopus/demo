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
    fieldTypeControl: new FormControl('', Validators.required),
    fieldDescControl: new FormControl('', Validators.required)
  });
  senderId = '';
  guestSigner: CompanyStaff = null;
  guestSigners: CompanyStaff[];
  cacheGuestSigners: CompanyStaff[];
  removable = true;
  isGuestContactsFetched = false;
  guestSigner_var = '';
  isContactToBeSaved = true;
  @ViewChild('focusField') focusField: ElementRef;
  constructor(private service: EzsigndataService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddguestsComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log('Add signers ngOnInit');
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

      // if (this.senderId === '') {
      //   return;
      // }
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
      // this.guestSignerForm.controls['receiverEmailIdControl'].setValue('');
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
    console.log('field type');
    console.log(this.fieldType);
    console.log('field description');
    console.log(this.fieldDesc);
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

    if (!this.fieldType) {
      this.snackBar.open("Please select field type", '', { duration: 3000 });
      return;
    }

    if (!this.fieldDesc) {
      this.snackBar.open("Please enter field description", '', { duration: 3000 });
      return;
    }

    this.showAddFieldSpinner = true;
    let isSender = "N";
    let isSenderSigner = "N";

    let fieldData = new EzSignField();
    fieldData.receiverFirstName = this.firstName;
    fieldData.receiverLastName = this.lastName;
    fieldData.receiverEmailId = temailId;
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

    fieldData.fieldType = this.guestSignerForm.controls['fieldTypeControl'].value;
    fieldData.labelName = this.guestSignerForm.controls['fieldDescControl'].value;
    let fieldMovingOffset = new Offset();
    fieldMovingOffset.x = 0;
    fieldMovingOffset.y = 0;
    let fieldEndOffset = new Offset;
    fieldEndOffset.x = 0;
    fieldEndOffset.y = 0;
    fieldData.fieldMovingOffset = fieldMovingOffset;
    fieldData.fieldEndOffset = fieldEndOffset;
    console.log('guest field data');
    console.log(fieldData);
    this.addFieldsRef.addFieldData(fieldData);
    this.showAddFieldSpinner = false;
    this.cancelPopup();
    this.cancelAddSignersPopup();
  }

  saveAsContact(event) {
    if (event.checked) {
      this.isContactToBeSaved = true;
    } else {
      this.isContactToBeSaved = false;
    }
  }

  selectFieldType(event: any) {
    console.log('select field type selection');
    console.log(event);

    if (event.value === 'signature') {
      this.guestSignerForm.controls['fieldDescControl'].setValue('Sign here');
    } else if (event.value === 'text') {
      this.guestSignerForm.controls['fieldDescControl'].setValue('Text field, e.g. Title Here');
    } else if (event.value === 'date') {
      this.guestSignerForm.controls['fieldDescControl'].setValue('Select date');
    } else if (event.value === 'initial') {
      this.guestSignerForm.controls['fieldDescControl'].setValue('Initial here');
    }
  }

  cancelPopup() {
    this.dialogRef.close();
  }
  cancelAddSignersPopup() {
    this.addSignersRef.cancelPopup();
  }
}
