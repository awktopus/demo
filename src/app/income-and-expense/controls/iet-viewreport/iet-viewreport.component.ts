import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../esign/service/esignservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IncomeExpenseSettingsComponent } from '../settings/iet-settings.component';
import { GridColConfigPopupComponent } from '../../../esign/controls/history/gridcolpopup/grid-col-config-popup.component'
import { TaxYearReceipts, Receipts, CoAReceipts, ChartOfAccounts, Company } from '../../../esign/beans/ESignCase';
import { ButtonRendererComponent } from '../../button-renderer.component';
import { IetAddreceiptComponent } from '../../controls/iet-addreceipt/iet-addreceipt.component';
import { ConfirmationDialogComponent } from '../../../esign/controls/shared/confirmation-dialog/confirmation-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-iet-viewreport',
  templateUrl: './iet-viewreport.component.html',
  styleUrls: ['./iet-viewreport.component.scss']
})
export class IetViewreportComponent implements OnInit {
  companyId: string;
  companyTypeId: any;
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
  gridActionInprogress = false;
  includeAccountNumber: any;
  showDownloadSpinner = false;
  isIETDataFetched = false;
  downloadAs: any;
  selectedCompany: Company;
  rowClassRules: any;
  fiscalClosingMonth: number;
  constructor(private service: EsignserviceService, public dialog: MatDialog,
    private route: ActivatedRoute, private router: Router) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    }
  }

  ngOnInit() {
    console.log('iet-viewreport initialization...');
    this.route.paramMap.subscribe(para => {
      this.companyId = para.get('companyId');
    });
    console.log('companyId: ' + this.companyId);
    this.service.getClientCompanyInfo(this.companyId).subscribe(cInfo => {
      if (cInfo) {
        console.log('client company info' + this.companyId);
        console.log(cInfo);
        this.selectedCompany = <Company>cInfo;
        this.companyTypeId = this.selectedCompany.companyTypeId;
        this.includeAccountNumber = this.selectedCompany.includeAccountNumber;
        this.companyName = this.selectedCompany.companyName;
        this.fiscalClosingMonth = this.selectedCompany.closingMonth;
      }
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
        this.isIETDataFetched = true;
      });
    });
  }

  loadReceiptsGrid() {
    this.receipts = [];
    console.log('getCompanyYearlyReceipts...');
    // show account number based company's view account number settings
    console.log('showing account number based on company settings')
    console.log('include accout number setting:')
    console.log(this.includeAccountNumber);
    if (this.includeAccountNumber === "Y") {
      this.allReceiptsGridColumnApi.setColumnsVisible(["accountNumber"], true);
    } else {
      this.allReceiptsGridColumnApi.setColumnsVisible(["accountNumber"], false);
    }

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
                receipt.accountNumber = coaAcct.accountNumber;
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
        headerName: 'Account', field: 'accountType', cellStyle: this.changeRowColor,
            },
      {
        headerName: 'Account Number', field: 'accountNumber', width: 100,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Name', field: 'vendorName',
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Receipt', field: 'receiptDate', width: 100,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Amount', field: 'amount', width: 100,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Note', field: 'notes',
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Download', width: 125,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.downloadReceipt.bind(this),
          label: 'get_app'
        },
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Edit', width: 100,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.editReceipt.bind(this),
          label: 'edit',
        },
        suppressSizeToFit: true,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Delete', width: 100,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.openConfirmationDialogforCompanyDeletion.bind(this),
          label: 'delete_forever'
        },
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Content Type', hide: 'true', field: 'contentType',
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'File Name', hide: 'true', field: 'attachment',
        cellStyle: this.changeRowColor
      }
    ]

    // this.rowClassRules = {
    //   "sick-days-warning": function(params) {
    //     console.log('inside row class rules sick days warning');
    //     console.log(params);
    //         return 10 > 5;
    //   }
    // };
    //  this.context = { componentParent: this, allreceipts: false };
    return res;
  }

  changeRowColor(params) {
    if (params.node.rowIndex % 2 === 0) {
      // return {'background-color': '#ccccff' };
       return {'background-color': '#ebfaeb' };
    }
    if (params.node.rowIndex % 2 === 1) {
      return {'background-color': '#ffffff'};
   }
 }

  downloadYearlyReceiptsCSV() {
    let params = {
      fileName: this.companyName + '_' + this.fiscalYear + '_Income&Expenses'
    };
    this.allReceiptsGridApi.exportDataAsCsv(params);
  }

  setViewReportInfo(companyTypeId: string, companyId: string, companyName: string, includeAccountNumber: any) {
    this.companyId = companyId;
    this.companyTypeId = companyTypeId;
    this.companyName = companyName;
    this.includeAccountNumber = includeAccountNumber;
  }

  cancelViewReport() {
    //   this.dialogRef.close();
  }

  getCompanyYearlyReceipts() {
    this.loadReceiptsGrid();
  }

  downloadYearlyReceipts() {
    console.log('download Yearly Receipts...');
    this.showDownloadSpinner = true;
    this.service.downloadYearlyReceipts(this.service.auth.getOrgUnitID(),
      this.companyId, this.companyName, this.fiscalYear);
    this.showDownloadSpinner = false;
  }

  deleteReceipt(deletedRow: any) {
    console.log('deleteReceipt...');
    console.log('docId:' + deletedRow.rowData.docId);
    this.service.deleteReceiptImage(this.service.auth.getOrgUnitID(), this.companyId, deletedRow.rowData.docId).subscribe(resp => {
      this.loadReceiptsGrid();
      this.gridActionInprogress = false;
    });
  }

  openConfirmationDialogforCompanyDeletion(deletedRow: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px', height: '150px',
      data: "Do you confirm the deletion of this receipt?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.gridActionInprogress = true;
        this.deleteReceipt(deletedRow);
      }
    });
  }

  downloadReceipt(downloadRow: any) {
    console.log('downloadReceipt...');
    console.log(downloadRow);
    this.service.downloadReceipt(this.service.auth.getOrgUnitID(),
      this.companyId, downloadRow.rowData.docId, downloadRow.rowData.attachment);
  }

  editReceipt(editRow: any) {
    console.log('edit Receipt...');

    const dialogRef = this.dialog.open(IetAddreceiptComponent, {
      width: '700px', height: '900px'
    });
    dialogRef.componentInstance.ietViewReportRef = this;
    dialogRef.componentInstance.setOperation('editreceipt');
    dialogRef.componentInstance.setEditReceiptInfo(this.companyTypeId, this.companyId,
      this.fiscalYear, editRow.rowData.accountType, editRow.rowData.accountTypeSeqNo,
      editRow.rowData.receiptDate, editRow.rowData.vendorName, editRow.rowData.amount,
      editRow.rowData.notes, editRow.rowData.docId, editRow.rowData.attachment);
  }
  navigateIETracker() {
    const url = 'main/incomeexpense/settings';
    this.router.navigateByUrl(url);
  }
  onDownloadAsSelection() {
    console.log('onDownloadAsSelection');
    console.log(this.downloadAs);
  }

  downloadReport() {
    console.log('download report');
    if (this.downloadAs === 'PDF') {
      this.downloadYearlyReceipts();
    }
    if (this.downloadAs === 'CSV') {
      this.downloadYearlyReceiptsCSV();
    }
  }

}
