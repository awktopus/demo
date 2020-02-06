import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IncomeExpenseSettingsComponent } from '../settings/iet-settings.component';
import { EsignserviceService } from '../../../esign/service/esignservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange, MatSelect, MatInput } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { disableDebugTools } from '@angular/platform-browser';
import { IetViewreportComponent } from '../../controls/iet-viewreport/iet-viewreport.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NumberFormatStyle } from '@angular/common';
import { CurrencyMaskModule } from "ng2-currency-mask";
@Component({
  selector: 'app-iet-addreceipt',
  templateUrl: './iet-addreceipt.component.html',
  styleUrls: ['./iet-addreceipt.component.scss']
})
export class IetAddreceiptComponent implements OnInit {
  ietSettingsRef: IncomeExpenseSettingsComponent;
  ietViewReportRef: IetViewreportComponent;
  companyId: string;
  companyTypeId: string;
  vendorName: string;
  accountType: string;
  amount: number;
  notes: any = '';
  accountTypes: any;
  // uploadedReceiptFile: string;
  receiptUploaded = false;
  receiptFile: File;
  dataUrl: any;
  fileUploadready = false;
  planModel: any = { start_time: new Date() };
  receiptDate: any;
  operation: string;
  fiscalYear: string;
  title: string;
  accountTypeSeqNo: any;
  docId: string;
  showAddspinner = false;
  showEditspinner = false;
  isPdfFile = true;
  receiptFiles: File;
  clientctrl: FormControl = new FormControl();
  accounttypeclientctrl: FormControl = new FormControl();
  removable = true;
  atremovable = true;
  vendors: any;
  vendorNameInput: any;
  accounttypeInput: any;
  accIdentifier: any;
  files: any = [];
  uploadedFileName: string;
  uploadedReceiptFile: File;
  attachment: string;

  receiptForm: FormGroup = new FormGroup({
    vendorNameFormControl: new FormControl('', Validators.required),
    accountTypeFormControl: new FormControl('', Validators.required),
    amountFormControl: new FormControl('', [Validators.required, Validators.min(1)]),
    receiptDateFormControl: new FormControl((new Date()).toISOString(), Validators.required),
    notesFormControl: new FormControl('')
});

@ViewChild('focusField') focusField: ElementRef;

  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<IetAddreceiptComponent>) {
      dialogRef.disableClose = true;
     }

  ngOnInit() {
    console.log('iet receipt initialization...');
    this.service.getAccountTypes(this.companyTypeId).subscribe(resp => {
      this.accountTypes = resp;
      console.log('account types');
      console.log(this.accountTypes);
      this.service.getVendors(this.service.auth.getOrgUnitID(), '').subscribe(vResp => {
        this.vendors = vResp;
      });
      console.log('vendors');
      console.log(this.vendors);
    if (this.operation === 'addreceipt') {
      this.title = 'Add Receipt';
    } else {
      this.title = 'Edit Receipt';
        console.log('Edit Receiptttttt');
         this.accountTypes.forEach(element => {
           console.log(element.acctId);
            if (Number(element.acctId) === Number(this.accountTypeSeqNo)) {
              console.log('matched');
              this.accountType = element.acctDescription;
              console.log('elementttt:' + this.accountType);
            }
         });
         this.receiptForm.controls['vendorNameFormControl'].setValue(this.vendorName);
         this.receiptForm.controls['accountTypeFormControl'].setValue(this.accountType);
         this.receiptForm.controls['amountFormControl'].setValue(this.amount);
         this.receiptForm.controls['notesFormControl'].setValue(this.notes);
         console.log('files');
         var rFile = new File([""], this.attachment);
         this.files.push(rFile);
         this.uploadedFileName = this.attachment;
         console.log(this.files);
         let rDate: Date = new Date(this.receiptDate);
         console.log('date:' + rDate.getDate());
         console.log('month:' + rDate.getMonth());
         console.log('year:' + rDate.getFullYear());
         this.receiptDate = rDate.getMonth() + 1 + '/' + rDate.getDate() + '/' + rDate.getFullYear();
         this.receiptForm.controls['receiptDateFormControl'].setValue(new Date(rDate.getFullYear(),
                                                                      rDate.getMonth(), rDate.getDate()));
         console.log('receipt date:');
         console.log(this.receiptForm.controls['receiptDateFormControl'].value);
         this.vendorName = "";
         this.accountType = "";
    }
   this.focusField.nativeElement.focus();
  });
  this.receiptForm.controls['vendorNameFormControl'].valueChanges.subscribe(val => {
    console.log('client control auto typing...' + val);
    console.log('vendor name:' + this.vendorName);
    if (this.vendorName === '') {
      return;
    }
    if (val && typeof val !== 'object') {
      if (this.vendorName === val.trim()) {
        return;
      } else {
        this.service.getVendors(this.service.auth.getOrgUnitID(), val).subscribe(vResp => {
          this.vendors = vResp;
        });
      }
    } else {
      this.service.getVendors(this.service.auth.getOrgUnitID(), val).subscribe(vResp => {
        this.vendors = vResp;
      });
    }
  });

  this.receiptForm.controls['accountTypeFormControl'].valueChanges.subscribe(val => {
    console.log('account type client control auto typing...' + val);
    console.log('account type name:' + this.accountType);
     if (val === '' || val === null) {
       return;
     }
    if (val !== "undefined") {
    if (val && typeof val !== 'object') {
      if (this.accountType === val.trim()) {
        return;
      } else {
        this.service.getAccountTypesBySearchToken(this.companyTypeId, val).subscribe(resp => {
          console.log('resp');
          console.log(resp);
          if (resp) {
          this.accountTypes = resp;
          console.log('account types');
          console.log(this.accountTypes);
        }
        });
      }
    } else {
      this.service.getAccountTypesBySearchToken(this.companyTypeId, val).subscribe(resp => {
        this.accountTypes = resp;
        console.log('account types');
        console.log(this.accountTypes);
      });
    }
  }
  });

  }

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element);
      this.receiptFile = element;
      this.uploadedFileName = element.name;
    }
  }
  deleteAttachment(index) {
    this.files.splice(index, 1);
    this.uploadedFileName = null;
  }

  setOperation(operation: string) {
    this.operation = operation;
  }
  setAddReceiptInfo(companyTypeId: string, companyId: string) {
    this.companyId = companyId;
    this.companyTypeId = companyTypeId;
  }

  add(event: any): void {
  console.log('add event');
  console.log(event);
    let input = event.input;
    let value = event.value;
  }

  onKey(event) {
    console.log('on Key tab event');
    console.log(event);
    console.log(this.accounttypeInput);
    console.log(this.accountType);
    if (!this.accountType || this.accountType === 'undefined') {
      this.accounttypeInput = null;
    }
  }

  accountTypefocusOut() {
    console.log('accountTypefocusOut event');
    console.log(this.accounttypeInput);
    console.log(this.accountType);
    if (!this.accountType || this.accountType === 'undefined') {
      this.accounttypeInput = null;
    }
  }

  setEditReceiptInfo(companyTypeId: string, companyId: string, fiscalYear: string,
    accountType: string, accountTypeSeqNo: string, receiptDate: string,
    vendorName: string, amount: NumberFormatStyle, notes: string, docId: string, attachment: string) {
    this.companyId = companyId;
    this.companyTypeId = companyTypeId;
    this.accountType = accountType;
    this.accountTypeSeqNo = accountTypeSeqNo;
    this.accIdentifier = this.accountTypeSeqNo;
    this.receiptDate = receiptDate;
    this.vendorName = vendorName;
    this.amount = amount;
    this.notes = notes;
    this.docId = docId;
    this.fiscalYear = fiscalYear;
    this.attachment = attachment;
    console.log('set edit receipt info');
    console.log('companyId:');
    console.log(this.companyId);
    console.log('companyTypeId:');
    console.log(this.companyTypeId);
    console.log('accountType:');
    console.log(this.accountType);
    console.log('accountTypeSeqNo:');
    console.log(this.accountTypeSeqNo);
    console.log('receiptDate:');
    console.log(this.receiptDate);
    console.log('vendorName:');
    console.log(this.vendorName);
    console.log('amount:');
    console.log(this.amount);
    console.log('notes:');
    console.log(this.notes);
    console.log('docId:');
    console.log(this.docId);
    console.log('fiscalYear:');
    console.log(this.fiscalYear)
  }

  cancelAddReceipt() {
    if (this.operation === 'editreceipt') {
      this.ietViewReportRef.loadReceiptsGrid();
    }
    this.dialogRef.close();
  }

  selectVendor(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add vendor:' + value);
    if ((value && event.isUserInput && this.vendors)) {
      let c: any = null;
      this.vendors.forEach(cc => { if (cc === value) { c = cc; } });
      this.vendorName = c;
      this.receiptForm.controls['vendorNameFormControl'].setValue('');
    }
    console.log('vendorName:' + this.vendorName);
  }

  removeVendor(): void {
    console.log('remove vendor');
    this.receiptForm.controls['vendorNameFormControl'].setValue('');
      this.vendorName = null;
      this.service.getVendors(this.service.auth.getOrgUnitID(), '').subscribe(vResp => {
        this.vendors = vResp;
      });
  }

  selectAccountType(event: MatOptionSelectionChange): void {
    console.log('select account type');
    console.log(event);
    const value = event.source.value;
    console.log('add account type selection value:' + value);
    if ((value && event.isUserInput && this.accountTypes)) {
      console.log('inside if');
      let c: any = null;
      this.accountTypes.forEach(cc => { if (cc.acctNo === value) { c = cc; } });
      console.log('value of c');
      console.log(c);
      this.accountType = c.acctDescription;
      this.accIdentifier = c.acctId;
      this.receiptForm.controls['accountTypeFormControl'].setValue('');
    }
    console.log('account Type:');
    console.log(this.accountType);
  }

  removeAccountType(): void {
    console.log('remove account type');
    this.receiptForm.controls['accountTypeFormControl'].setValue('');
      this.accountType = null;
      this.service.getAccountTypes(this.companyTypeId).subscribe(resp => {
        this.accountTypes = resp;
        console.log('account types');
        console.log(this.accountTypes);
      });
  }


  // uploadReceiptFile(recFiles: File | FileList) {
  //   console.log('uploadReceiptFile...')

  //   if (recFiles instanceof (FileList)) {
  //     this.receiptFile = recFiles.item(0);
  //      } else {
  //     console.log('else part');
  //     this.receiptFile = recFiles;
  //     let extn = this.receiptFile.name.substring(this.receiptFile.name.lastIndexOf('.') + 1 ,
  //     this.receiptFile.name.length) || this.receiptFile.name;
  //     console.log('extn:' + extn);
  //     if (extn.toLowerCase() === 'pdf') {
  //       this.uploadedReceiptFile = this.receiptFile.name;
  //       this.receiptUploaded = true;
  //       this.isPdfFile = true;
  //     } else {
  //       this.receiptUploaded = false;
  //       this.isPdfFile = false;
  //     }
  //   }
  // }

  addReceipt() {
    this.showAddspinner = true;
    console.log('addReceipt');
    console.log('operation: ' + this.operation);
   // let currentDate: Date = new Date(this.planModel.start_time)
   let currentDate: Date = new Date(this.receiptForm.controls['receiptDateFormControl'].value);
    console.log('date:' + currentDate.getDate());
    console.log('month:' + currentDate.getMonth());
    console.log('year:' + currentDate.getFullYear());
    this.receiptDate = currentDate.getMonth() + 1 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
    console.log('receipt date:' + this.receiptDate);
    if (typeof this.vendorNameInput === 'undefined') {
      this.vendorNameInput = '';
    }
    this.vendorName = this.vendorNameInput;
    console.log('notes:');
    console.log(this.notes);
    if (this.operation === 'addreceipt') {
      if (this.notes === 'undefined' || this.notes === null) {
        this.notes = "";
      }
      this.service.addNewReceiptPDF(this.service.auth.getOrgUnitID(),
        this.service.auth.getUserID(), this.companyId, this.amount, this.notes, this.service.auth.getUserID(),
        this.receiptDate,
         this.vendorName, this.accIdentifier, this.receiptFile).subscribe(resp => {
          console.log(resp);
          this.dialogRef.close();
          this.showAddspinner = false;
          });
    } else {
      this.showAddspinner = false;
      }
   }

   updateReceipt() {
    this.showEditspinner = true;
    console.log('finalizeUpdateReceipt');
    console.log('operation: ' + this.operation);
    let currentDate: Date = new Date(this.receiptForm.controls['receiptDateFormControl'].value);
    console.log('date:' + currentDate.getDate());
    console.log('month:' + currentDate.getMonth());
    console.log('year:' + currentDate.getFullYear());
    console.log('vendorNameInput');
    console.log(this.vendorNameInput);
    if (typeof this.vendorNameInput === 'undefined') {
      this.vendorNameInput = '';
    }
    if (this.vendorNameInput !== '') {
    this.vendorName = this.vendorNameInput;
  }
    console.log(this.vendorName);
    this.receiptDate = currentDate.getMonth() + 1 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
    console.log('receipt date:' + this.receiptDate);
    if (this.notes === 'undefined' || this.notes === null) {
      this.notes = "";
    }
    const newReceiptJson = {
        amount: this.amount,
        notes: this.notes,
        uploadCustomerId: this.service.auth.getUserID(),
        receiptDate: this.receiptDate,
        vendorName: this.vendorName,
        accountTypeSeqNo: this.accIdentifier,
        docId: this.docId
      };
      console.log(newReceiptJson);
      if (this.operation === 'addreceipt') {
        this.showEditspinner = false;
      } else {
        this.service.updateReceipt(this.service.auth.getOrgUnitID(),
        this.companyId, this.fiscalYear, this.accIdentifier, newReceiptJson).subscribe(resp => {
          console.log(resp);
          this.ietViewReportRef.loadReceiptsGrid();
          this.dialogRef.close();
          this.showEditspinner = false;
          });

        }
  }
}
