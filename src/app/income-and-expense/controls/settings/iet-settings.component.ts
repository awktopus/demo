import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormControl } from '@angular/forms';
import { CompanyType, ESignCPA, CompanyStaff, Company } from './../../../esign/beans/ESignCase';
import { EsignserviceService } from './../../../esign/service/esignservice.service';
import { resolveRendererType2 } from '@angular/core/src/view/util';
import { IetAddreceiptComponent } from '../iet-addreceipt/iet-addreceipt.component';
import { IetViewreportComponent } from '../iet-viewreport/iet-viewreport.component';
import { EsignuiserviceService } from '../../../esign/service/esignuiservice.service';
import { IetCompanyComponent } from '../iet-company/iet-company.component';
import { ConfirmationDialogComponent } from '../../../esign/controls/shared/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-iet-settings',
  templateUrl: './iet-settings.component.html',
  styleUrls: ['./iet-settings.component.scss']
})
export class IncomeExpenseSettingsComponent implements OnInit, AfterViewInit {
  companyId: any;
  sharedUsers: any;
  closeDate: any;
  removable = true;
  clientCompanies: any;
  hasCompanies = false;
  setupNewCmpny = false;
  companies: Company[] = [];
  constructor(private service: EsignserviceService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router,
    private uiservice: EsignuiserviceService
  ) { }

  ngAfterViewInit() {
  }

  ngOnInit() {
    console.log('iet setting pages init');
    this.service.getClientCompanies(this.service.auth.getOrgUnitID(), this.service.auth.getUserID()).subscribe(resp => {
      this.clientCompanies = resp;
      console.log('getClientCompanies');
      console.log(this.clientCompanies);
      this.loadCompanies();
    });
  }

  loadCompanies() {
    this.companies = [];
    if (this.clientCompanies.companies) {
      if (this.clientCompanies.companies.length === 0) {
        this.hasCompanies = false;
        this.companies = [];
      } else {
        this.hasCompanies = true;
        this.clientCompanies.companies.forEach(resCmpny => {
          let cmpny = new Company();
          cmpny.companyId = resCmpny.companyId;
          cmpny.companyTypeId = resCmpny.companyTypeId;
          cmpny.companyType = resCmpny.companyType;
          cmpny.companyName = resCmpny.companyName;
          cmpny.companyOwner = resCmpny.companyOwner.firstName + ' ' + resCmpny.companyOwner.lastName;
          cmpny.closingMonthName = resCmpny.closingMonthName;
          cmpny.lastUpdate = resCmpny.lastUpdate;
          cmpny.closeDate = resCmpny.closingMonth;
          cmpny.includeAccountNumber = resCmpny.includeAccountNumber;
          cmpny.sharedUsersList = resCmpny.sharedUsers;
          cmpny.hasSettingsAccess = resCmpny.hasSettingsAccess;
          let sharedUsrs = ' ';
          if (resCmpny.sharedUsers) {
            resCmpny.sharedUsers.forEach(sUser => {
              if (resCmpny.sharedUsers.length === 1) {
              sharedUsrs = sharedUsrs + sUser.firstName + ' ' + sUser.lastName;
            } else {
              sharedUsrs = sharedUsrs + sUser.firstName + ' ' + sUser.lastName + '; ';
            }
            });
          }
          cmpny.sharedUsers = sharedUsrs;
          this.companies.push(cmpny);
        });
      }
    }
  }

  setupNewCompany() {
    // this.setupNewCmpny = true;
    console.log('setupNewCompany:');
    const dialogRef = this.dialog.open(IetCompanyComponent, {
      width: '700px', height: '500px'
    });
    dialogRef.componentInstance.ietSettingsRef = this;
    dialogRef.componentInstance.setMode('newcompany');
  }

  editCompany(clientCompany: Company) {
    console.log('editCompany:');
    const dialogRef = this.dialog.open(IetCompanyComponent, {
      width: '700px', height: '500px'
    });
    dialogRef.componentInstance.ietSettingsRef = this;
    dialogRef.componentInstance.setMode('editcompany');
    dialogRef.componentInstance.setEditCompanyinfo(clientCompany);
  }

  deleteCompany(companyId: string) {
    console.log('delete company:' + companyId);
    this.service.deleteCompany(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(), companyId).subscribe(resp => {
      console.log(resp);
      this.clientCompanies = resp;
      this.loadCompanies();
    });
  }

  addReceipt(companyTypeId: string, companyId: string) {
    console.log('add Receipt:');
    console.log(companyTypeId);
    console.log(companyId);
    const dialogRef = this.dialog.open(IetAddreceiptComponent, {
      width: '700px', height: '600px'
    });
    dialogRef.componentInstance.ietSettingsRef = this;
    dialogRef.componentInstance.setOperation('addreceipt');
    dialogRef.componentInstance.setAddReceiptInfo(companyTypeId, companyId);
  }

  viewReport(companyTypeId: string, companyId: string, companyName: string) {
    console.log('viewReport');
    console.log(companyTypeId);
    console.log(companyId);
    console.log(companyName);
    const dialogRef = this.dialog.open(IetViewreportComponent, {
      width: '1200px'
    });
    dialogRef.componentInstance.ietSettingsRef = this;
    dialogRef.componentInstance.setViewReportInfo(companyTypeId, companyId, companyName);
  }

  openConfirmationDialogforCompanyDeletion(cmpnyId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px', height: '150px',
      data: "Do you confirm the deletion of this company?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
         this.deleteCompany(cmpnyId);
      }
    });
  }
}
