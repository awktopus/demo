import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../esign/service/esignservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IncomeExpenseSettingsComponent } from '../settings/iet-settings.component';
import { GridColConfigPopupComponent } from '../../../esign/controls/history/gridcolpopup/grid-col-config-popup.component'
import { TaxYearReceipts, Receipts, CoAReceipts, ChartOfAccounts } from '../../../esign/beans/ESignCase';
import { ButtonRendererComponent } from '../../button-renderer.component';
import { IetAddreceiptComponent } from '../../controls/iet-addreceipt/iet-addreceipt.component';
@Component({
  selector: 'app-iet-viewreport',
  templateUrl: './iet-viewreport.component.html',
  styleUrls: ['./iet-viewreport.component.scss']
})
export class IetViewreportComponent implements OnInit {
  companyId: string;
  companyTypeId: string;
  companyName: string;
  companyAccountLevelReceipts: any;
  allReceiptsgridData: Receipts[];
  allReceiptsGridApi: any = {};
  allReceiptsGridColumnApi: any = {};
  gridColumnDefs: any;
  context: any;
  frameworkComponents: any;
  ietSettingsRef: IncomeExpenseSettingsComponent;
  fiscalYears: any;
  fiscalYear: any;
  taxYearReceipts: any;
  receipts: Receipts[] = [];
  chartOfAccounts: any;
  coaReceipts: any;
  yearlySummaryAmount: any;
  autoGroupColumnDef: any;
  statusBar: any;
  defaultColDef: any;
  autoHeight: any;
  constructor(private service: EsignserviceService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<IetViewreportComponent>) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    }
  }

  ngOnInit() {
    console.log('iet-viewreport initialization...');
    this.gridColumnDefs = this.configColDef();
    this.service.getFiscalYearlist(this.service.auth.getOrgUnitID(), this.companyId).subscribe(resp2 => {
      this.fiscalYears = resp2;
      console.log(this.fiscalYears);
      if (resp2 && this.fiscalYears.length > 0) {
        this.fiscalYear = this.fiscalYears[0];
        console.log('default fiscal year:' + this.fiscalYear);
      } else {
        const fisDate = new Date();
        this.fiscalYear = fisDate.getFullYear();
      }
      console.log('fiscal year list');
      console.log(this.fiscalYears);
      this.loadReceiptsGrid();
    });
  }

  loadReceiptsGrid() {
    this.receipts = [];
    console.log('getCompanyYearlyReceipts...');
    this.service.getCompanyAccountLevelReceipts(this.service.auth.getOrgUnitID(),
      this.companyId, this.fiscalYear).subscribe(resp => {
        if (resp) {
          this.taxYearReceipts = <TaxYearReceipts>resp;
          console.log('Tax Yearly Receipts:');
          console.log(this.taxYearReceipts);
          this.yearlySummaryAmount = this.taxYearReceipts.yearlySummaryAmount;
          console.log('yearly Summary Amount:' + this.yearlySummaryAmount);
          console.log(this.taxYearReceipts.chartOfAccounts);
          if (this.taxYearReceipts.chartOfAccounts) {
            this.taxYearReceipts.chartOfAccounts.forEach(coaAcct => {
              console.log(coaAcct);
              coaAcct.coaReceipt.forEach(coaRec => {
                let receipt = new Receipts();
                receipt.accountType = coaAcct.accountType;
                receipt.amount = coaRec.amount;
                receipt.attachment = coaRec.attachment;
                receipt.docId = coaRec.docId;
                receipt.notes = coaRec.notes;
                receipt.receiptDate = coaRec.receiptDate;
                receipt.vendorName = coaRec.vendorName;
                receipt.accountTypeSeqNo = coaAcct.accountTypeSeqNo;
                receipt.contentType = coaRec.contentType;
                this.receipts.push(receipt);
              });
            });
          }
          this.allReceiptsgridData = this.receipts;
          console.log('All receipts grid data:');
          console.log(this.allReceiptsgridData);
        } else {
          this.allReceiptsgridData = this.receipts;
        }
      });
  }
  onGridReady(params) {
    this.allReceiptsGridApi = params.api;
    this.allReceiptsGridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  configColDef() {
    const res = [
      {
        headerName: 'Account Type', field: 'accountType', width: 250, suppressSizeToFit: true,
        cellStyle: { 'justify-content': "flex-end" }
      },
      {
        headerName: 'Receipt Date', field: 'receiptDate', width: 100, suppressSizeToFit: true,
        cellStyle: { 'justify-content': "flex-end" }
      },
      {
        headerName: 'Name', field: 'vendorName', width: 200, suppressSizeToFit: true,
        cellStyle: { 'justify-content': "flex-end" }
      },
      {
        headerName: 'Amount', field: 'amount', width: 100, suppressSizeToFit: true,
        cellStyle: { 'justify-content': "flex-end" }
      },
      {
        headerName: 'Notes', field: 'notes', width: 150, suppressSizeToFit: true,
        cellStyle: { 'justify-content': "center" }
      },
      {
        headerName: 'Content Type', hide: 'true', field: 'contentType', width: 250, suppressSizeToFit: true,
        cellStyle: { 'justify-content': "center" }
      },
      {
        width: 100,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.editReceipt.bind(this),
          label: 'EDIT',
        },
        suppressSizeToFit: true,
        cellStyle: { 'justify-content': "center" }
      },
      {
        width: 120,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.downloadReceipt.bind(this),
          label: 'DOWNLOAD'
        },
        suppressSizeToFit: true,
        cellStyle: { 'justify-content': "center" }
      },
      {
        width: 100,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.deleteReceipt.bind(this),
          label: 'DELETE'
        },
        suppressSizeToFit: true,
        cellStyle: { 'justify-content': "center" }
      }
    ]
    //  this.context = { componentParent: this, allreceipts: false };
    return res;
  }

  downloadYearlyReceiptsCSV() {
    let params = {
      fileName: this.fiscalYear + '_YearlyReceipts'
    };
    this.allReceiptsGridApi.exportDataAsCsv(params);
  }

  setViewReportInfo(companyTypeId: string, companyId: string, companyName: string) {
    this.companyId = companyId;
    this.companyTypeId = companyTypeId;
    this.companyName = companyName;
  }
  cancelViewReport() {
    this.dialogRef.close();
  }

  getCompanyYearlyReceipts() {
    this.loadReceiptsGrid();
  }

  downloadYearlyReceipts() {
    console.log('download Yearly Receipts...');
    this.service.downloadYearlyReceipts(this.service.auth.getOrgUnitID(),
      this.companyId, this.fiscalYear);
  }

  deleteReceipt(deletedRow: any) {
    console.log('deleteReceipt...');
    console.log('docId:' + deletedRow.rowData.docId);
    this.service.deleteReceiptImage(this.service.auth.getOrgUnitID(), this.companyId, deletedRow.rowData.docId).subscribe(resp => {
      this.loadReceiptsGrid();
    });
  }

  downloadReceipt(downloadRow: any) {
    console.log('downloadReceipt...');
    this.service.downloadReceipt(this.service.auth.getOrgUnitID(),
      this.companyId, downloadRow.rowData.docId);
  }

  editReceipt(editRow: any) {
    console.log('edit Receipt...');

    const dialogRef = this.dialog.open(IetAddreceiptComponent, {
      width: '900px', height: '650px'
    });
    dialogRef.componentInstance.ietViewReportRef = this;
    dialogRef.componentInstance.setOperation('editreceipt');
    dialogRef.componentInstance.setEditReceiptInfo(this.companyTypeId, this.companyId,
      this.fiscalYear, editRow.rowData.accountType, editRow.rowData.accountTypeSeqNo,
      editRow.rowData.receiptDate, editRow.rowData.vendorName, editRow.rowData.amount,
      editRow.rowData.notes, editRow.rowData.docId);
  }
}
