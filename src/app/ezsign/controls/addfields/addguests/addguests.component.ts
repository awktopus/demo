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
  firstNameInput: any;
  receiverEmailId: any;
  guestSignerForm: FormGroup = new FormGroup({
    guestSignerCtrl: new FormControl('', Validators.required),
    receiverLastNameControl: new FormControl(''),
    receiverEmailIdControl: new FormControl(''),
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
  isContactToBeSaved = false;
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

    this.guestSignerForm.controls['guestSignerCtrl'].valueChanges.subscribe(searchToken => {
      console.log('guest signer name search called');
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
            if ((cc.firstName && cc.firstName.toLowerCase().search(searchToken.toLowerCase()) !== -1) ||
              (cc.lastName && cc.lastName.toLowerCase().search(searchToken.toLowerCase()) !== -1)) {
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
      this.guestSignerForm.controls['guestSignerCtrl'].setValue('');
      this.guestSignerForm.controls['receiverEmailIdControl'].setValue(this.guestSigner.emailId);
    }
  }

  removeGuest(): void {
    this.guestSigner = null;
    this.focusField.nativeElement.value = "";
    this.guestSignerForm.controls['receiverEmailIdControl'].setValue('');
    this.firstNameInput = null;
    this.cacheGuestSigners = <CompanyStaff[]>this.cacheGuestSigners;
  }

  addGuestFieldData() {
    console.log('add guest field data - start');
    console.log(this.guestSigner);
    console.log(this.firstNameInput)
    if (!this.guestSigner && (typeof this.firstNameInput === 'undefined'
      || this.firstNameInput === '' || this.firstNameInput === null)) {
      this.snackBar.open("Search for a guest contact or Enter first name", '', { duration: 3000 });
      return;
    }
    if (this.guestSigner) {
      this.firstName = this.guestSigner.firstName;
      this.lastName = this.guestSigner.lastName;
    } else {
      this.firstName = this.firstNameInput;
      this.lastName = this.guestSignerForm.controls['receiverLastNameControl'].value;
    }
    // if (!this.firstName) {
    //   this.snackBar.open("Please enter guest first name", '', { duration: 3000 });
    //   return ;
    // }
    // if (!this.lastName) {
    //   this.snackBar.open("Please enter guest last name", '', { duration: 3000 });
    //   return ;
    // }
    if (!this.receiverEmailId) {
      this.snackBar.open("Please enter guest email address", '', { duration: 3000 });
      return;
    }
    this.showAddFieldSpinner = true;
    let isSender = "N";
    let isSenderSigner = "N";
    let fieldData = new EzSignField();
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
    fieldData.isContactTobeSaved = this.isContactToBeSaved;
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
      this.guestSignerForm.controls['fieldDescControl'].setValue('Text field title here');
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
