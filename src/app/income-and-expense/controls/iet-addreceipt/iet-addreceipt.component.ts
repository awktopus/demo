import { Component, OnInit } from '@angular/core';
import { IncomeExpenseSettingsComponent } from '../settings/iet-settings.component';
import { EsignserviceService } from '../../../esign/service/esignservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { disableDebugTools } from '@angular/platform-browser';
import { IetViewreportComponent } from '../../controls/iet-viewreport/iet-viewreport.component';
import { FormControl } from '@angular/forms';
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
  // receiptDate: string;
  amount: string;
  notes: any = '';
  accountTypes: any;
  uploadedReceiptFile: string;
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
  removable = true;
  vendors: any;
  vendorNameInput: any;
  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<IetAddreceiptComponent>) { }

  ngOnInit() {
    console.log('iet-addreceipt initialization...');
    console.log('account Type seq No:' + this.accountTypeSeqNo);
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
        console.log(this.accountTypeSeqNo);
         this.accountTypes.forEach(element => {
           console.log(element.acctId);
            if (Number(element.acctId) === Number(this.accountTypeSeqNo)) {
              console.log('matched');
              // this.accountType = element.acctNo + '-' + element.acctDescription;
              this.accountType = element.acctId;
              console.log('elementttt:' + this.accountType);
            }
         });
    }
  });
  this.clientctrl.valueChanges.subscribe(val => {
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
  }

  setOperation(operation: string) {
    this.operation = operation;
  }
  setAddReceiptInfo(companyTypeId: string, companyId: string) {
    this.companyId = companyId;
    this.companyTypeId = companyTypeId;
  }

  setEditReceiptInfo(companyTypeId: string, companyId: string, fiscalYear: string,
    accountType: string, accountTypeSeqNo: string, receiptDate: string,
    vendorName: string, amount: string, notes: string, docId: string) {
    this.companyId = companyId;
    this.companyTypeId = companyTypeId;
    this.accountType = accountType;
    this.accountTypeSeqNo = accountTypeSeqNo;
    this.receiptDate = receiptDate;
    this.vendorName = vendorName;
    this.amount = amount;
    this.notes = notes;
    this.docId = docId;
    this.fiscalYear = fiscalYear;
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
      this.clientctrl.setValue('');
    }
    console.log('vendorName:' + this.vendorName);
  }

  removeVendor(): void {
    console.log('remove vendor');
      this.vendorName = null;
      this.service.getVendors(this.service.auth.getOrgUnitID(), '').subscribe(vResp => {
        this.vendors = vResp;
      });
  }

  uploadReceiptFile(recFiles: File | FileList) {
    console.log('uploadReceiptFile...')

    if (recFiles instanceof (FileList)) {
      this.receiptFile = recFiles.item(0);
       } else {
      console.log('else part');
      this.receiptFile = recFiles;
      let extn = this.receiptFile.name.substring(this.receiptFile.name.lastIndexOf('.') + 1 ,
      this.receiptFile.name.length) || this.receiptFile.name;
      console.log('extn:' + extn);
      if (extn.toLowerCase() === 'pdf') {
        this.uploadedReceiptFile = this.receiptFile.name;
        this.receiptUploaded = true;
        this.isPdfFile = true;
      } else {
        this.receiptUploaded = false;
        this.isPdfFile = false;
      }
    }
  }

  finalizeAddReceipt() {
    this.showAddspinner = true;
    console.log('finalizeAddReceipt');
    console.log('operation: ' + this.operation);
    let currentDate: Date = new Date(this.planModel.start_time)
    console.log('date:' + currentDate.getDate());
    console.log('month:' + currentDate.getMonth());
    console.log('year:' + currentDate.getFullYear());
    this.receiptDate = currentDate.getMonth() + 1 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
    console.log('receipt date:' + this.receiptDate);
    if (typeof this.vendorNameInput === 'undefined') {
      this.vendorNameInput = '';
    }
    this.vendorName = this.vendorNameInput;
    if (this.operation === 'addreceipt') {
      if (this.notes === 'undefined' || this.notes !== null) {
        this.notes = "";
      }
      this.service.addNewReceiptPDF(this.service.auth.getOrgUnitID(),
        this.service.auth.getUserID(), this.companyId, this.amount, this.notes, this.service.auth.getUserID(),
        this.receiptDate,
         this.vendorName, this.accountType, this.receiptFile).subscribe(resp => {
          console.log(resp);
          this.dialogRef.close();
          this.showAddspinner = false;
          });
    } else {
      this.showAddspinner = false;
      }
   }

  finalizeUpdateReceipt() {
    this.showEditspinner = true;
    console.log('finalizeUpdateReceipt');
    console.log('operation: ' + this.operation);
    let currentDate: Date = new Date(this.planModel.start_time)
    console.log('date:' + currentDate.getDate());
    console.log('month:' + currentDate.getMonth());
    console.log('year:' + currentDate.getFullYear());
    if (typeof this.vendorNameInput === 'undefined') {
      this.vendorNameInput = '';
    }
    this.vendorName = this.vendorNameInput;
    this.receiptDate = currentDate.getMonth() + 1 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
    console.log('receipt date:' + this.receiptDate);
    if (this.notes === 'undefined' && this.notes !== null) {
      this.notes = "";
    }
    const newReceiptJson = {
        amount: this.amount,
        notes: this.notes,
        uploadCustomerId: this.service.auth.getUserID(),
        receiptDate: this.receiptDate,
        vendorName: this.vendorName,
        accountTypeSeqNo: this.accountType,
        docId: this.docId
      };
      console.log(newReceiptJson);
      if (this.operation === 'addreceipt') {
        this.showEditspinner = false;
      } else {
        this.service.updateReceipt(this.service.auth.getOrgUnitID(),
        this.companyId, this.fiscalYear, this.accountType, newReceiptJson).subscribe(resp => {
          console.log(resp);
          this.ietViewReportRef.loadReceiptsGrid();
          this.dialogRef.close();
          });
          this.showEditspinner = false;
        }
  }
}
