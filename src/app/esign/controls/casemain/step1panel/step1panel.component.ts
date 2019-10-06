import { Component, OnInit } from '@angular/core';
import { MatDialog, MatOptionSelectionChange } from '@angular/material';
import { ESignCase, ESignCate, ESignClient, ESignCPA, ESignConfig, ClientAnswer, TaxYears } from '../../../beans/ESignCase';
import { forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { EsignserviceService } from '../../../service/esignservice.service';
import { EsignuiserviceService } from '../../../service/esignuiservice.service';
import { ClientAnswerComponent } from '../../settings/identity/client-answer/client-answer.component';
import { SetClientAnswerComponent } from '../../settings/identity/set-client-answer/set-client-answer.component';
@Component({
  selector: 'app-step1panel',
  templateUrl: './step1panel.component.html',
  styleUrls: ['./step1panel.component.scss']
})
export class Step1panelComponent implements OnInit {
  initcaseheader: ESignCase;
  searchCPA = '';
  CPAID = '';
  clientctrl: FormControl = new FormControl();
  secclientctrl: FormControl = new FormControl();
  recclientctrl: FormControl = new FormControl();
  cpactrl: FormControl = new FormControl();
  casecates: ESignCate[] = [];
  subcates: ESignCate[] = [];
  clients: ESignClient[];
  cpas: ESignCPA[] = [];
  ntypes: String[];
  scpas: ESignCPA[];
  recclients: ESignClient[];
  recSelclients: ESignClient[];
  searchRecClient = '';
  secclients: ESignClient[];
  primarysigner: ESignClient = null;
  secondarysigner: ESignClient = null;
  // binding values
  category: number;
  subcategory: number;
  ccCPA: string;
  removable = true;
  config: ESignConfig;
  client_var = '';
  secclient_var = '';
  recclient_var = '';
  cap_var = '';
  mycase: ESignCase;
  cachecpas: ESignCPA[];
  returnName: string;
  taxReturnIdNo: string;
  identityQuestion: string;
  identityAnswer: string;
  answerId: string;
  orgQtnId: string;
  taxYear: any;
  taxYears: TaxYears[];
  // isLoading = true;
  disableTaxYear = false;
  showSavespinner = false;
  showUpdatespinner = false;
  caseDataloading = false;
  constructor(private service: EsignserviceService, private uiservice: EsignuiserviceService, public dialog: MatDialog) {
    this.recSelclients = [];
    this.scpas = [];
  }
  ngOnInit() {
    this.caseDataloading = true;
    forkJoin([
      this.service.getEsignConfig(),
      this.service.getCPAs()
    ]).subscribe(results => {
      this.config = <ESignConfig>results[0];
      console.log('esign config');
      console.log(results);
      this.casecates = this.config.eSignCates;
      this.cpas = <ESignCPA[]>results[1];
      this.cachecpas = <ESignCPA[]>results[1];
      this.CPAID = this.service.auth.getUserID();
      this.cpas.forEach(ele => {
          if (ele.cpaClients) {
          this.clients = ele.cpaClients;
          this.secclients = ele.cpaClients;
          this.recclients = ele.cpaClients;
          console.log('cpa clients');
          console.log(this.clients);
        }
        this.caseDataloading = false;
      });
      if (this.initcaseheader) {
        this.setcaseHeader(this.initcaseheader);
      }
      this.service.cur_case.subscribe(c => {
        this.mycase = c; // this is to sync caseID
        if (this.initcaseheader !== this.mycase) {
          this.initcaseheader = this.mycase;
          this.setcaseHeader(this.initcaseheader);
        }
      });
    });
    this.clientctrl.valueChanges.subscribe(val => {
      console.log('clientctrl search clients called');
      console.log(val.trim());
      console.log(this.client_var);
      console.log(typeof val);
      console.log(this.primarysigner);
      if (this.CPAID === '') {
        return;
      }
      if (this.primarysigner) {
        return;
      }
      if (val && typeof val !== 'object') {
        if (this.client_var === val.trim()) {
          return;
        } else {
          this.uiservice.searchClientContacts(this.CPAID, val).subscribe(resp => {
            this.clients = <ESignClient[]>resp;
          });
        }
      } else {
        console.log('else');
        console.log(this.CPAID);
        console.log(val);
        this.uiservice.searchClientContacts(this.CPAID, val).subscribe(resp => {
          this.clients = <ESignClient[]>resp;
        });
      }
    });
    this.secclientctrl.valueChanges.subscribe(val => {
      console.log('secclientctrl search clients called');
      console.log(val.trim());
      console.log(this.secclient_var);
      if (this.CPAID === '') {
        return;
      }
      if (this.secondarysigner) {
        return;
      }
      if (val && typeof val !== 'object') {
        if (this.secclient_var === val.trim()) {
          return;
        } else {
          this.uiservice.searchClientContacts(this.CPAID, val).subscribe(resp => {
            this.secclients = <ESignClient[]>resp;
          });
        }
      } else {
        this.uiservice.searchClientContacts(this.CPAID, val).subscribe(resp => {
          this.secclients = <ESignClient[]>resp;
        });
      }
    });
    this.recclientctrl.valueChanges.subscribe(val => {
      console.log('recclientctrl search clients called')
      console.log(val.trim());
      console.log(this.recclient_var);
      if (val && typeof val !== 'object') {
        console.log('val:' + val);
        console.log('recclient_var' + this.recclient_var);
        if (this.recclient_var === val.trim()) {
          return;
        } else {
          if (this.CPAID === '') {
            return;
          }
          this.uiservice.searchClientContacts(this.CPAID, val).subscribe(resp => {
            console.log(resp);
            this.recclients = <ESignClient[]>resp;
          });
        }
      }
    });
    this.cpactrl.valueChanges.subscribe(val => {
      if (val && typeof val !== 'object') {
        // console.log(val);
        if (this.cap_var === val.trim()) {
          return;
        } else {
          if (this.CPAID === '') {
            return;
          }
          this.uiservice.searchCPAContacts(this.CPAID, val).subscribe(resp => {
            //   console.log(resp);
            this.cpas = <ESignCPA[]>resp;
          });
        }
      }
    });
    this.uiservice.getDistinctTaxYears().subscribe(resp => {
      this.taxYears = <TaxYears[]>resp;
    });
  // this.isLoading = false;
  }

  categoryChange(event): void {
    console.log('--->', event);
    this.casecates.forEach(ele => { if (ele.id === event.value) { this.subcates = ele.subCates; } });
    if (event.value === 4) {
      this.disableTaxYear = true;
    } else {
      this.disableTaxYear = false;
    }
    console.log('disable tax year:' + this.disableTaxYear);
   // console.log(this.taxYears);
    if (this.disableTaxYear === false && this.taxYears) {
      console.log('inside tax year setup if');
      this.taxYear = this.taxYears[0].id;
     } else {
      console.log('inside tax year setup else');
      this.taxYear = 0;
     }
  }
  addcpa(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    if ((value && event.isUserInput)) {
      let c: ESignCPA = null;
      let ec: ESignCPA = null;
      this.cpas.forEach(cc => { if (cc.cpaId === value) { c = cc; } });
      this.scpas.forEach(cc => { if (cc.cpaId === c.cpaId) { ec = cc; } });
      if (!ec) {
        // console.log(c);
        this.scpas.push(c);
      }
    }
    console.log(this.searchCPA);
    this.searchCPA = '';
  }
  add(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    // Add our fruit
    console.log('value:' + value);
    console.log(event);
    console.log('add recipient clients:' + this.recclients);
    if ((value && event.isUserInput)) {
      let c: ESignClient = null;
      let ec: ESignClient = null;
      this.recclients.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.recSelclients.forEach(cc => { if (cc.clientId === c.clientId) { ec = cc; } });
      if (!ec) {
        // console.log(c);
        this.recSelclients.push(c);
      }
      this.recclientctrl.setValue('');
    }
    console.log(this.searchRecClient);
    this.searchRecClient = '';
  }
  addPrimary(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add primary client' + value);
    if ((value && event.isUserInput && this.clients)) {
      let c: ESignClient = null;
      this.clients.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.primarysigner = c;
      this.clientctrl.setValue('');
    }
  }
  addSecondary(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add secondary client' + value);
    if ((value && event.isUserInput && this.secclients)) {
      let c: ESignClient = null;
      this.secclients.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.secondarysigner = c;
      this.secclientctrl.setValue('');
    }
  }
  removeClient(c: ESignClient): void {
    console.log('remove client recipient');
    const index = this.recSelclients.indexOf(c);
    if (index >= 0) {
      this.recSelclients.splice(index, 1);
    }
  }
  removeSinger(s: string): void {
    console.log(s + 'remove singer');
    if (s === 'primary') {
      this.primarysigner = null;
      this.uiservice.searchClientContacts(this.CPAID, '').subscribe(resp => {
        this.clients = <ESignClient[]>resp
      });
    } else {
      this.secondarysigner = null;
      this.uiservice.searchClientContacts(this.CPAID, '').subscribe(resp => {
        this.secclients = <ESignClient[]>resp
      });
    }
  }
  removeCPA(c: ESignCPA): void {
    const index = this.scpas.indexOf(c);
    if (index >= 0) {
      this.scpas.splice(index, 1);
    }
  }
  setInitCase(caseheader: ESignCase) {
    console.log('set init case', caseheader);
    this.initcaseheader = caseheader;
  }
  setcaseHeader(caseheader: ESignCase) {
    this.primarysigner = caseheader.primarySigner;
    this.secondarysigner = caseheader.secondarySigner;
    console.log('inside set case header..primary signer');
    console.log(this.primarysigner);
    if (caseheader.recipientClients) {
      this.recSelclients = caseheader.recipientClients;
    } else {
      this.recSelclients = [];
    }
    if (caseheader.copyCpas) {
      this.scpas = caseheader.copyCpas;
    } else {
      this.scpas = [];
    }
    if (caseheader.cate) {
      this.category = caseheader.cate.id;
      // here we need to populate the subcate first
      this.casecates.forEach(ele => { if (ele.id === this.category) { this.subcates = ele.subCates; } });

      // console.log(this.casecates);
      if (caseheader.subCate) {
        this.subcategory = caseheader.subCate.id;
      }
    } else {
      this.category = null;
      this.subcates = [];
    }
    if (caseheader.returnName) {
      this.returnName = caseheader.returnName;
    } else {
      this.returnName = null;
    }
    if (caseheader.taxReturnIdNo) {
      this.taxReturnIdNo = caseheader.taxReturnIdNo;
    } else {
      this.taxReturnIdNo = null;
    }
    if (caseheader.taxYear) {
      this.taxYear = caseheader.taxYear;
    } else {
      this.taxYear = null;
    }
  }

  captureCaseJson(): any {
    const clients: ESignClient[] = [];
    this.recSelclients.forEach(ele => { clients.push(ele); });
    const cpas: ESignCPA[] = [];
    this.scpas.forEach(ele => { cpas.push(ele); });
    let cpa: ESignCPA = null;
    this.cachecpas.forEach(ele => { if (ele.cpaId === this.service.auth.getUserID()) { cpa = ele; } });
    const casejson = {
      Cpa: cpa,
      OrgUnitId: this.service.auth.getOrgUnitID(),
      PrimarySigner: this.primarysigner,
      SecondarySigner: this.secondarysigner,
      TaxReturnCategory: this.category,
      TaxReturnSubCategory: this.subcategory,
      RecipientClients: clients,
      copyCpas: cpas,
      returnName: this.returnName,
      taxReturnIdNo: this.taxReturnIdNo,
      taxYear: this.taxYear
    };
    console.log(casejson);
    return casejson;
  }
  saveCase(): void {
    this.showSavespinner = true;
    const casejson = this.captureCaseJson();
    console.log(casejson);
    this.service.saveCase(casejson).subscribe(resp => {
      //  console.log(resp);
      const rr = <ESignCase>resp;
      console.log('save case');
      console.log(rr);
      this.service.mergeCaseHeader(rr);
      this.uiservice.setStepper(1);
      this.showSavespinner = false;
    });
  }

  updateCase() {
    this.showUpdatespinner = true;
    const casejson = this.captureCaseJson();
    this.service.updateCaseHeader(casejson).subscribe(resp => {
      //  console.log(resp);
      const rr = <ESignCase>resp;
      console.log(rr);
      this.service.mergeCaseHeader(rr);
      this.uiservice.setStepper(1);
      this.showUpdatespinner = false;
    });
  }
  setClientIdentityAnswer(clientId: string, clientType: string, ansId: string) {
    console.log('set client Identity' + clientId + ' ansId:' + ansId);
    const dialogRef = this.dialog.open(SetClientAnswerComponent, {
      width: '1460px'
    });
    dialogRef.componentInstance.setSource('newCase', clientId, clientType);
    dialogRef.componentInstance.step1panelref = this;
  }
}

export interface Jsonresp {
  caseId: String;
  caseStatus: String;
  caseType: String;
  cpaId: String;
  createdDate: String;
  createdUserId: String;
}


