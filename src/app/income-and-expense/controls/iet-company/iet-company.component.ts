import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IncomeExpenseSettingsComponent } from '../settings/iet-settings.component';
import { CompanyType, ESignCPA, CompanyStaff, Company } from './../../../esign/beans/ESignCase';
import { EsignserviceService } from './../../../esign/service/esignservice.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { EsignuiserviceService } from '../../../esign/service/esignuiservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  closeDate: number;
  searchCPA = '';
  companyName: any;
  companyType: any;
  companyTypeId: number;
  operation: string; // create new companby or edit existing company
  includeAccountNumber = true;
 // cpactrl: FormControl = new FormControl();
  companyId: string;
  removable = true;
  showNewCompanyspinner = false;
  showEditCompanyspinner = false;

  companyForm: FormGroup = new FormGroup({
    companyNameFormControl: new FormControl('', Validators.required),
    companyTypeFormControl: new FormControl('', Validators.required),
    closingDateFormControl: new FormControl('', Validators.required),
    sharedUserFormControl: new FormControl(''),
   // includeAccountNumberFormControl: new FormControl(''),
  });
  @ViewChild('focusField') focusField: ElementRef;

  constructor(private service: EsignserviceService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router,
    private uiservice: EsignuiserviceService, public dialogRef: MatDialogRef<IetCompanyComponent>
  ) { this.scpas = [];
    dialogRef.disableClose = true;
  }

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

    this.service.getCompanyStaff().subscribe(results => {
      this.cpas = <CompanyStaff[]>results;
      console.log('company staff');
      console.log(this.cpas);
    });

    if (this.operation === 'newcompany') {
      this.title = 'Add Company';
      this.focusField.nativeElement.focus();
      this.closeDate = 12;
    } else {
      console.log('edit company');
      this.title = 'Edit Company';
      if (this.sharedUsersList) {
        this.scpas = this.sharedUsersList;
      } else {
        this.scpas = [];
      }
      this.companyForm.controls['companyNameFormControl'].setValue(this.companyName);
      this.companyForm.controls['companyTypeFormControl'].setValue(this.companyType);
      this.companyForm.controls['closingDateFormControl'].setValue(this.closeDate);
      this.focusField.nativeElement.focus();
    }
  });

    // this.companyForm.controls['sharedUserFormControl'].valueChanges.subscribe(val => {
    //   console.log('sharedUserFormControl search clients called');
    //   console.log(val.trim());
    //   console.log(this.secclient_var);
    //   if (this.CPAID === '') {
    //     return;
    //   }
    //   if (this.secondarysigner) {
    //     return;
    //   }
    //   if (val && typeof val !== 'object') {
    //     if (this.secclient_var === val.trim()) {
    //       return;
    //     } else {
    //       this.uiservice.searchClientContacts(this.CPAID, val).subscribe(resp => {
    //         this.secclients = <ESignClient[]>resp;
    //       });
    //     }
    //   } else {
    //     this.uiservice.searchClientContacts(this.CPAID, val).subscribe(resp => {
    //       this.secclients = <ESignClient[]>resp;
    //     });
    //   }
    // });
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
    this.includeAccountNumber = true
    this.companyId = clientCompany.companyId;
    this.sharedUsersList = clientCompany.sharedUsersList;
    }

  addcpa(event: MatOptionSelectionChange): void {
    console.log('add shared users');
    console.log(event);
    console.log('event source value');
    console.log(event.source.value);
    console.log(this.cpas);
    console.log(this.scpas);
    const value = event.source.value;
    if ((value && event.isUserInput)) {
      let c: CompanyStaff = null;
      let ec: CompanyStaff = null;
      this.cpas.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.scpas.forEach(cc => { if (cc.clientId === c.clientId) { ec = cc; } });
      if (!ec) {
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
    console.log('companyId:' + this.companyId);
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
      companyId: this.companyId,
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
