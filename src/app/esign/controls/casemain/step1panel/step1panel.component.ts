import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatOptionSelectionChange, MatSelect } from '@angular/material';
import { ESignCase, ESignCate, ESignClient, ESignCPA, ESignConfig, ClientAnswer, TaxYears } from '../../../beans/ESignCase';
import { forkJoin } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
//  clientctrl: FormControl = new FormControl();
//   secclientctrl: FormControl = new FormControl();
//   recclientctrl: FormControl = new FormControl();
//   cpactrl: FormControl = new FormControl();
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
  // category: number;
  // subcategory: number;
  ccCPA: string;
  removable = true;
  config: ESignConfig;
  client_var = '';
  secclient_var = '';
  recclient_var = '';
  cap_var = '';
  mycase: ESignCase;
  cachecpas: ESignCPA[];
  // returnName: string;
  // taxReturnIdNo: string;
  identityQuestion: string;
  identityAnswer: string;
  answerId: string;
  orgQtnId: string;
  // taxYear: any;
  taxYears: TaxYears[];
  // isLoading = true;
  disableTaxYear = false;
  showSavespinner = false;
  showUpdatespinner = false;
  caseDataloading = false;
  caseType: string;
  caseStep1Form: FormGroup = new FormGroup({
    category: new FormControl('', Validators.required),
    subcategory: new FormControl('', Validators.required),
    taxYear: new FormControl('', Validators.required),
    returnName: new FormControl('', Validators.required),
    taxReturnIdNo: new FormControl('', Validators.required),
    clientctrl: new FormControl('', Validators.required),
    secclientctrl: new FormControl(''),
    recclientctrl: new FormControl(''),
    cpactrl: new FormControl('')
  });

  @ViewChild('focusField') focusField: MatSelect;

  constructor(private service: EsignserviceService, private uiservice: EsignuiserviceService, public dialog: MatDialog) {
    this.recSelclients = [];
    this.scpas = [];
  }
  ngOnInit() {
    this.caseDataloading = true;
    this.focusField.focused = true;
    // forkJoin([
    //   this.service.getEsignConfig(),
    //   this.service.getCPAs()
    // ]).subscribe(results => {
    //   this.config = <ESignConfig>results[0];
    //   console.log('esign config');
    //   console.log(results);
    //   this.casecates = this.config.eSignCates;
    //   this.cpas = <ESignCPA[]>results[1];
    //   this.cachecpas = <ESignCPA[]>results[1];
    //   this.CPAID = this.service.auth.getUserID();
    //   this.cpas.forEach(ele => {
    //       if (ele.cpaClients) {
    //       this.clients = ele.cpaClients;
    //       this.secclients = ele.cpaClients;
    //       this.recclients = ele.cpaClients;
    //       console.log('cpa clients');
    //       console.log(this.clients);
    //     }
    //     this.caseDataloading = false;
    //   });


        this.service.getEsignConfig().subscribe(results => {
        this.config = <ESignConfig>results;
        console.log('esign config');
        console.log(results);
        this.casecates = this.config.eSignCates;
        this.caseDataloading = false;
        });

        this.service.getCPAs().subscribe(clientsResp => {
        this.cpas = <ESignCPA[]>clientsResp;
        this.cachecpas = <ESignCPA[]>clientsResp;
        this.CPAID = this.service.auth.getUserID();
        this.cpas.forEach(ele => {
            if (ele.cpaClients) {
            this.clients = ele.cpaClients;
            this.secclients = ele.cpaClients;
            this.recclients = ele.cpaClients;
            console.log('cpa clients');
            console.log(this.clients);
          }
        });


      if (this.initcaseheader) {
        console.log('step1 panel: init case header inside if');
        console.log(this.initcaseheader);
        this.setcaseHeader(this.initcaseheader);
      }
      if (this.caseType === 'newcase') {
      this.service.cur_case.subscribe(c => {
        this.mycase = c; // this is to sync caseID
        console.log('cur case:');
        console.log(this.mycase);
        if (this.initcaseheader !== this.mycase) {
          this.initcaseheader = this.mycase;
          this.setcaseHeader(this.initcaseheader);
        }
      });
    }
    });


    this.caseStep1Form.controls['clientctrl'].valueChanges.subscribe(val => {
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

    this.caseStep1Form.controls['secclientctrl'].valueChanges.subscribe(val => {
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


    this.caseStep1Form.controls['recclientctrl'].valueChanges.subscribe(val => {
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


    this.caseStep1Form.controls['cpactrl'].valueChanges.subscribe(val => {
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
      this.caseStep1Form.controls['taxYear'].setValue(this.taxYears[0].id);
     } else {
      console.log('inside tax year setup else');
      this.caseStep1Form.controls['taxYear'].setValue(0);
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
      this.caseStep1Form.controls['recclientctrl'].setValue('');
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
      this.caseStep1Form.controls['clientctrl'].setValue('');
    }
  }
  addSecondary(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add secondary client' + value);
    if ((value && event.isUserInput && this.secclients)) {
      let c: ESignClient = null;
      this.secclients.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.secondarysigner = c;
      this.caseStep1Form.controls['secclientctrl'].setValue('');
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
  setInitCase(caseheader: ESignCase, caseType: string) {
    console.log('set init case', caseheader);
    console.log('case type:', caseType);
    this.initcaseheader = caseheader;
    this.caseType = caseType;
  }
  setcaseHeader(caseheader: ESignCase) {
    this.primarysigner = caseheader.primarySigner;
    if (this.primarysigner) {
      this.caseStep1Form.controls['clientctrl'].setValue(this.primarysigner.clientId);
    }
    this.secondarysigner = caseheader.secondarySigner;
    if (this.secondarysigner) {
    this.caseStep1Form.controls['clientctrl'].setValue(this.secondarysigner.clientId);
  }
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
      this.caseStep1Form.controls['category'].setValue(caseheader.cate.id)
      // here we need to populate the subcate first
      this.casecates.forEach(ele => { if (ele.id === this.caseStep1Form.controls['category'].value) {
         this.subcates = ele.subCates;
         if (caseheader.subCate) {
          this.caseStep1Form.controls['subcategory'].setValue(caseheader.subCate.id);
        }
        } });
      // console.log(this.casecates);
    } else {
      this.caseStep1Form.controls['subcategory'].setValue(null);
      this.subcates = [];
    }
    if (caseheader.returnName) {
      this.caseStep1Form.controls['returnName'].setValue(caseheader.returnName);
    } else {
      this.caseStep1Form.controls['returnName'].setValue(null);
    }
    if (caseheader.taxReturnIdNo) {
      this.caseStep1Form.controls['taxReturnIdNo'].setValue(caseheader.taxReturnIdNo);
    } else {
      this.caseStep1Form.controls['taxReturnIdNo'].setValue(null);
    }
    if (caseheader.taxYear) {
      this.caseStep1Form.controls['taxYear'].setValue(caseheader.taxYear);
    } else {
      this.caseStep1Form.controls['taxYear'].setValue(null);
    }
    console.log('FORM GROUP');
    console.log(this.caseStep1Form);
    // this.caseStep1Form.reset();
    // this.caseStep1Form.get['category'].updateValueAndValidity();
    // this.caseStep1Form.get['subcategory'].updateValueAndValidity();
    // this.caseStep1Form.get['taxReturnIdNo'].updateValueAndValidity();
    // this.caseStep1Form.get['returnName'].updateValueAndValidity();
    // this.caseStep1Form.get['taxYear'].updateValueAndValidity();
    // this.caseStep1Form.get['clientctrl'].updateValueAndValidity();
    // this.caseStep1Form.get['secclientctrl'].updateValueAndValidity();
    // this.caseStep1Form.get['recclientctrl'].updateValueAndValidity();
    // this.caseStep1Form.get['cpactrl'].updateValueAndValidity();
    // this.caseStep1Form.updateValueAndValidity();
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
      TaxReturnCategory: this.caseStep1Form.controls['category'].value,
      TaxReturnSubCategory: this.caseStep1Form.controls['subcategory'].value,
      RecipientClients: clients,
      copyCpas: cpas,
      returnName: this.caseStep1Form.controls['returnName'].value,
      taxReturnIdNo: this.caseStep1Form.controls['taxReturnIdNo'].value,
      taxYear: this.caseStep1Form.controls['taxYear'].value
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

