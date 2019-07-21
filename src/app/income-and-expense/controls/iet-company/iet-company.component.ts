import { Component, OnInit } from '@angular/core';
import { IncomeExpenseSettingsComponent } from '../settings/iet-settings.component';
import { CompanyType, ESignCPA, CompanyStaff, Company } from './../../../esign/beans/ESignCase';
import { EsignserviceService } from './../../../esign/service/esignservice.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { EsignuiserviceService } from '../../../esign/service/esignuiservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-iet-company',
  templateUrl: './iet-company.component.html',
  styleUrls: ['./iet-company.component.scss']
})
export class IetCompanyComponent implements OnInit {
  ietSettingsRef: IncomeExpenseSettingsComponent;
  title: string;
  finalAction: string;
  companyTypes: CompanyType[];
  scpas: CompanyStaff[];
  cpas: CompanyStaff[];
  sharedUsersList: CompanyStaff[];
  closeDate: any;
  searchCPA = '';
  companyName: any;
  companyType: any;
  companyTypeId: number;
  operation: string; // create new companby or edit existing company
  includeAccountNumber: any;
  cpactrl: FormControl = new FormControl();
  companyId: string;
  removable = true;
  showNewCompanyspinner = false;
  showEditCompanyspinner = false;
  // selectable = true;
  constructor(private service: EsignserviceService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router,
    private uiservice: EsignuiserviceService, public dialogRef: MatDialogRef<IetCompanyComponent>
  ) { this.scpas = []; }

  ngOnInit() {
    console.log('company details');
    console.log('companyName:' + this.companyName);
    console.log('companyType:' + this.companyType);
    console.log('companyTypeId:' + this.companyTypeId);
    console.log('closingDate:' + this.closeDate)
    console.log('operation:' + this.operation);
    console.log('companyId:' + this.companyId);

    this.service.getCompanyTypes().subscribe(resp => {
      this.companyTypes = <CompanyType[]>resp;
      console.log('company types');
      console.log(this.companyTypes);
      this.companyType = this.companyTypeId;
    });

    this.service.getCompanyStaff().subscribe(results => {
      this.cpas = <CompanyStaff[]>results;
      console.log('company staff');
      console.log(this.cpas);
    });

    if (this.operation === 'newcompany') {
      this.title = 'Setup New Company';
      this.closeDate = 12;
    } else {
      console.log('edit company');
      this.title = 'Edit Company';
      if (this.sharedUsersList) {
        this.scpas = this.sharedUsersList;
      } else {
        this.scpas = [];
      }
    }
  }

  setMode(operation: string) {
    this.operation = operation;
  }

  setEditCompanyinfo(clientCompany: Company) {
    console.log('set edit company in-fo:');
    console.log(clientCompany);
    this.companyName = clientCompany.companyName;
    this.companyType = clientCompany.companyType;
    this.companyTypeId = clientCompany.companyTypeId;
    this.closeDate = clientCompany.closeDate;
    if (clientCompany.includeAccountNumber === 'Y') {
      this.includeAccountNumber = true;
    } else {
      this.includeAccountNumber = false;
    }
    this.companyId = clientCompany.companyId;
    this.sharedUsersList = clientCompany.sharedUsersList;
  }

  addcpa(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    if ((value && event.isUserInput)) {
      let c: CompanyStaff = null;
      let ec: CompanyStaff = null;
      this.cpas.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.scpas.forEach(cc => { if (cc.clientId === c.clientId) { ec = cc; } });
      if (!ec) {
        // console.log(c);
        this.scpas.push(c);
      }
    }
    console.log(this.searchCPA);
    this.searchCPA = '';
  }

  removeCPA(c: CompanyStaff): void {
    console.log('remove cpa');
    console.log(this.scpas);
    const index = this.scpas.indexOf(c);
    if (index >= 0) {
      this.scpas.splice(index, 1);
    }
  }

  createCompany() {
    this.showNewCompanyspinner = true;
    console.log('create company');
    console.log('companyName:' + this.companyName);
    console.log('companyType:' + this.companyType);
    console.log('closingDate:' + this.closeDate)
    console.log('closingDate:');
    console.log(this.scpas);
    //   let localCpas: CompanyStaff[];
    //   if (this.scpas) {
    //     this.scpas.forEach(cc => {
    //       localCpas.push(cc);
    //     });
    //   }
    const newCompanyjson = {
      companyName: this.companyName,
      companyTypeId: this.companyType,
      closingMonth: this.closeDate,
      sharedUsers: this.scpas
    };
    console.log(newCompanyjson);
    this.service.createCompany(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(), newCompanyjson).subscribe(resp => {
      console.log(resp);
      this.ietSettingsRef.setupNewCmpny = false;
      this.ietSettingsRef.clientCompanies = resp;
      this.ietSettingsRef.loadCompanies();
      this.dialogRef.close();
      this.showNewCompanyspinner = false;
    });
  }

  updateCompanySettings() {
    this.showEditCompanyspinner = true;
    console.log('updateCompanySettings');
    console.log('companyName:' + this.companyName);
    console.log('companyType:' + this.companyType);
    console.log('closingDate:' + this.closeDate)
    console.log('includeAccountNumber:' + this.includeAccountNumber);
    console.log(this.scpas);
    //   let localCpas: CompanyStaff[];
    //   if (this.scpas) {
    //     this.scpas.forEach(cc => {
    //       localCpas.push(cc);
    //     });
    //   }
    let acctNumber = 'N';
    if (this.includeAccountNumber === true) {
      acctNumber = 'Y';
    } else {
      acctNumber = 'N';
    }
    const updateCompanyjson = {
      companyName: this.companyName,
      companyTypeId: this.companyType,
      closingMonth: this.closeDate,
      includeAccountNumber: acctNumber,
      sharedUsers: this.scpas
    };

    console.log(updateCompanyjson);
    this.service.updateCompany(this.service.auth.getOrgUnitID(),
    this.service.auth.getUserID(), this.companyId,
    updateCompanyjson).subscribe(resp => {
      console.log(resp);
      this.ietSettingsRef.setupNewCmpny = false;
      this.ietSettingsRef.clientCompanies = resp;
      this.ietSettingsRef.loadCompanies();
      this.dialogRef.close();
      this.showEditCompanyspinner = false;
    });
  }

  cancelNewCompany() {
    this.ietSettingsRef.setupNewCmpny = false;
    this.dialogRef.close();
  }
}
