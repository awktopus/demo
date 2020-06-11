import { Component, OnInit, ViewChild, Output, Input, EventEmitter, ElementRef } from '@angular/core';
import { MatDialog, MatOptionSelectionChange, MatSelect, MatSnackBar } from '@angular/material';
import { ESignCase, ESignCate, ESignClient, ESignCPA, ESignConfig, ClientAnswer, TaxYears } from '../../../beans/ESignCase';
import { forkJoin } from 'rxjs';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { EsignserviceService } from '../../../service/esignservice.service';
import { EsignuiserviceService } from '../../../service/esignuiservice.service';
import { ClientAnswerComponent } from '../../settings/identity/client-answer/client-answer.component';
import { SetClientAnswerComponent } from '../../settings/identity/set-client-answer/set-client-answer.component';
import { truncateSync } from 'fs';
import { COMMA, ENTER } from "@angular/cdk/keycodes";
@Component({
  selector: 'app-step1panel',
  templateUrl: './step1panel.component.html',
  styleUrls: ['./step1panel.component.scss']
})
export class Step1panelComponent implements OnInit {
  initcaseheader: ESignCase;
  searchCPA = '';
  CPAID = '';
  casecates: ESignCate[] = [];
  subcates: ESignCate[] = [];
  cacheClients: ESignClient[];
  primaryClients: ESignClient[];
  copyCpas: ESignCPA[] = [];
  ntypes: String[];
  selectedCopyCpas: ESignCPA[];
  recipientClients: ESignClient[];
  selectedRecipientClients: ESignClient[];
  searchRecClient = '';
  secondaryClients: ESignClient[];
  primarysigner: ESignClient = null;
  secondarysigner: ESignClient = null;
  ccCPA: string;
  removable = true;
  config: ESignConfig;
  client_var = '';
  secclient_var = '';
  recclient_var = '';
  cap_var = '';
  mycase: ESignCase;
  cacheCpas: ESignCPA[];
  identityQuestion: string;
  identityAnswer: string;
  answerId: string;
  orgQtnId: string;
  taxYears: TaxYears[];
  disableTaxYear = false;
  showSavespinner = false;
  showUpdatespinner = false;
  caseDataloading = false;
  caseType: string;
  caseStep1Form: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = false;
  @ViewChild("selectedRecipientInput") selectedRecipientInput: ElementRef;
  @ViewChild('focusField') focusField: MatSelect;
  @ViewChild('selectedCopyCpasInput') selectedCopyCpasInput: ElementRef;
  @ViewChild('primarySignerInput') primarySignerInput: ElementRef;
  @ViewChild('secondarySignerInput') secondarySignerInput: ElementRef;
  @Input()
  isModal = false;

  @Output()
  enterKeyPress = new EventEmitter();

  constructor(private service: EsignserviceService, private uiservice: EsignuiserviceService,
    public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.selectedRecipientClients = [];
    this.selectedCopyCpas = [];
    this.caseStep1Form = new FormGroup({
      category: new FormControl('', Validators.required),
      subcategory: new FormControl('', Validators.required),
      taxYear: new FormControl('', Validators.required),
      returnName: new FormControl('', Validators.required),
      taxReturnIdNo: new FormControl('', Validators.required),
      primarySignerControl: new FormControl('', [this.priSignerValidator()]),
      secondarySignerControl: new FormControl(''),
      recipientClientControl: new FormControl(''),
      copyCpaControl: new FormControl('')
    });
  }
  ngOnInit() {
    console.log('Case step1 ngOnInit');
    this.caseDataloading = true;
    this.focusField.focused = true;
    this.mycase = null;
    this.caseType = null;
    this.caseStep1Form.reset();
    this.service.getEsignConfig().subscribe(results => {
      this.config = <ESignConfig>results;
      console.log('case category config');
      console.log(results);
      this.casecates = this.config.eSignCates;
      this.caseDataloading = false;
    });

    console.log('case type:' + this.caseType);
    this.service.cur_case.subscribe(c => {
      this.mycase = c;
      console.log('cur case:');
      console.log(this.mycase);
      if (this.initcaseheader !== this.mycase) {
        this.initcaseheader = this.mycase;
        this.setcaseHeader(this.initcaseheader);
      }
    });

    if (this.initcaseheader) {
      console.log('Init case header inside if');
      console.log(this.initcaseheader);
      this.setcaseHeader(this.initcaseheader);
    }


    this.caseStep1Form.controls['primarySignerControl'].valueChanges.subscribe(searchToken => {
      console.log('primarySignerControl search clients called');
      console.log("searchToken:" + searchToken.trim());
      console.log(this.client_var);
      console.log(typeof searchToken);
      console.log(this.primarysigner);

      if (this.CPAID === '') {
        return;
      }
      if (this.primarysigner) {
        return;
      }
      if (searchToken && typeof searchToken !== 'object') {
        if (this.client_var === searchToken.trim()) {
          return;
        } else {
          console.log('primary signer searching...');
          this.primaryClients = [];
          console.log('cache clients');
          console.log(this.cacheClients);
          this.cacheClients.forEach(cc => {
            if ((cc.firstName && cc.firstName.toLowerCase().search(searchToken.toLowerCase()) !== -1) ||
              (cc.lastName && cc.lastName.toLowerCase().search(searchToken.toLowerCase()) !== -1)) {
              this.primaryClients.push(cc);
            }
          });
          console.log(this.primaryClients);
        }
      } else {
        this.primaryClients = <ESignClient[]>this.cacheClients;
      }
    });

    this.caseStep1Form.controls['secondarySignerControl'].valueChanges.subscribe(searchToken => {
      console.log('secondarySignerControl search clients called');
      console.log('search Token:' + searchToken.trim())
      console.log(this.secclient_var);
      if (this.CPAID === '') {
        return;
      }
      if (this.secondarysigner) {
        return;
      }
      if (searchToken && typeof searchToken !== 'object') {
        if (this.secclient_var === searchToken.trim()) {
          return;
        } else {
          console.log('secondary signer searching...');
          this.secondaryClients = [];
          this.cacheClients.forEach(cc => {
            if ((cc.firstName && cc.firstName.toLowerCase().search(searchToken.toLowerCase()) !== -1) ||
              (cc.lastName && cc.lastName.toLowerCase().search(searchToken.toLowerCase()) !== -1)) {
              this.secondaryClients.push(cc);
            }
          });
          console.log(this.secondaryClients);
        }
      } else {
        this.secondaryClients = <ESignClient[]>this.cacheClients;
      }
    });

    this.caseStep1Form.controls['recipientClientControl'].valueChanges.subscribe(searchToken => {
      console.log('recipientClientControl search clients called')
      console.log('search Token:' + searchToken.trim())
      console.log('recclient_var');
      console.log(this.recclient_var);
      if (this.CPAID === '') {
        return;
      }
      if (searchToken && typeof searchToken !== 'object') {
        if (this.recclient_var === searchToken.trim()) {
          return;
        } else {
          console.log('recipient client searching...');
          this.recipientClients = [];
          this.cacheClients.forEach(cc => {
            if ((cc.firstName && cc.firstName.toLowerCase().search(searchToken.toLowerCase()) !== -1) ||
              (cc.lastName && cc.lastName.toLowerCase().search(searchToken.toLowerCase()) !== -1)) {
              this.recipientClients.push(cc);
            }
          });
          console.log(this.recipientClients);
        }
       //  this.caseStep1Form.controls['recipientClientControl'].setValue('');
      } else {
        this.recipientClients = <ESignClient[]>this.cacheClients;
      }
    });

    this.caseStep1Form.controls['copyCpaControl'].valueChanges.subscribe(searchToken => {
      console.log('copyCpaControl search cpa called')
      console.log('search Token value, type:');
      console.log(searchToken.trim());
      console.log(typeof searchToken);
      console.log('cap_var');
      console.log(this.cap_var);
      if (this.CPAID === '') {
        return;
      }
      if (searchToken && typeof searchToken !== 'object') {
        if (this.cap_var === searchToken.trim()) {
          return;
        } else {
          console.log('copy cpas searching...');
          this.copyCpas = [];
          this.cacheCpas.forEach(cc => {
            if ((cc.firstName && cc.firstName.toLowerCase().search(searchToken.toLowerCase()) !== -1) ||
              (cc.lastName && cc.lastName.toLowerCase().search(searchToken.toLowerCase()) !== -1)) {
              this.copyCpas.push(cc);
            }
          });
          console.log(this.copyCpas);
        }
      } else {
        this.copyCpas = <ESignCPA[]>this.cacheCpas;
      }
    });


    this.uiservice.getDistinctTaxYears().subscribe(resp => {
      this.taxYears = <TaxYears[]>resp;
    });

    this.service.getCPAs().subscribe(clientsResp => {
      this.copyCpas = <ESignCPA[]>clientsResp;
      this.cacheCpas = <ESignCPA[]>clientsResp;
      this.CPAID = this.service.auth.getUserID();
      this.copyCpas.forEach(ele => {
        if (ele.cpaClients) {
          this.cacheClients = ele.cpaClients;
          this.primaryClients = ele.cpaClients;
          this.secondaryClients = ele.cpaClients;
          this.recipientClients = ele.cpaClients;
        }
      });
    });
  }


  priSignerValidator(): ValidatorFn {
    console.log("primary signer validator");
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const priSig = control.value;
      console.log('priSig:' + priSig);
      if (priSig === null || priSig === '') {
        return { 'priSigner': false };
      } else {
        return null;
      }
    };
  }

  primarySignerfocusOut() {
    console.log('primarySignerfocusOut event');
    this.priSignerValidator();
    this.primarySignerInput.nativeElement.value = "";
   // console.log(typeof this.primarysigner);
   // console.log(this.primarysigner);
   // if (!this.primarysigner || typeof this.primarysigner === "undefined") {
   //   console.log('inside if');
      //    this.caseStep1Form.controls['primarySignerControl'].setValue('');
   // }
  }

  primarySignerOnKey(event) {
  console.log('primarySignerOnKey event');
  //  console.log(this.primarysigner);
  //  if (!this.primarysigner || typeof this.primarysigner === "undefined") {
  //    this.caseStep1Form.controls['primarySignerControl'].setValue('');
  //  }
  this.primarySignerInput.nativeElement.value = "";
  this.caseStep1Form.controls['primarySignerControl'].setValue('');
  this.priSignerValidator();
  }

  secondarySignerfocusOut() {
    console.log('secondarySignerfocusOut event');
    this.secondarySignerInput.nativeElement.value = "";
   // console.log(typeof this.secondarysigner);
   // if (!this.secondarysigner || typeof this.secondarysigner === "undefined") {
   //   console.log('inside if');
   // this.caseStep1Form.controls['secondarySignerControl'].setValue('');
   // }
  }
  secondarySignerOnKey(event) {
    console.log('secondarySignerOnKey event');
    this.secondarySignerInput.nativeElement.value = "";
    // console.log(this.secondarysigner);
    // if (!this.secondarysigner || typeof this.secondarysigner === "undefined") {
    //   this.caseStep1Form.controls['secondarySignerControl'].setValue('');
    // }
  }

  categoryChange(event): void {
    console.log('--->', event);
    this.casecates.forEach(ele => { if (ele.id === event.value) { this.subcates = ele.subCates; } });
    if (event.value === 4) {
      this.disableTaxYear = true;
    } else {
      this.disableTaxYear = false;
    }
    if (this.disableTaxYear === false && this.taxYears) {
      this.caseStep1Form.controls['taxYear'].setValue(this.taxYears[0].id);
    } else {
      this.caseStep1Form.controls['taxYear'].setValue(0);
    }
  }

  addPrimarySigner(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add primary signer:' + value);
    if ((value && event.isUserInput && this.primaryClients)) {
      let c: ESignClient = null;
      this.primaryClients.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.primarysigner = c;
      console.log('added primary signer:');
      console.log(this.primarysigner);
      this.caseStep1Form.controls['primarySignerControl'].setValue('');
    }
  }

  addSecondarySigner(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add secondary signer:' + value);
    if ((value && event.isUserInput && this.secondaryClients)) {
      let c: ESignClient = null;
      this.secondaryClients.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.secondarysigner = c;
      console.log('added secondary signer:');
      console.log(this.secondarysigner);
    }
  }

  removeSinger(s: string): void {
    console.log(s + 'remove singer');
    if (s === 'primary') {
      this.primarysigner = null;
      this.caseStep1Form.controls['primarySignerControl'].setValue('');
      this.primaryClients = <ESignClient[]>this.cacheClients;
      this.priSignerValidator();
    } else {
      this.secondarysigner = null;
      this.caseStep1Form.controls['secondarySignerControl'].setValue('');
      this.secondaryClients = <ESignClient[]>this.cacheClients;
    }
  }

  addClientRecipient(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('Add client recipient value:');
    console.log(value);
    console.log(event);
    console.log('add recipient clients:');
    console.log(this.recipientClients);
    if ((value && event.isUserInput)) {
      let c: ESignClient = null;
      let ec: ESignClient = null;
      this.recipientClients.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.selectedRecipientClients.forEach(cc => { if (cc.clientId === c.clientId) { ec = cc; } });
      if (!ec) {
        this.selectedRecipientClients.push(c);
      }
      this.caseStep1Form.controls['recipientClientControl'].setValue('');
      this.selectedRecipientInput.nativeElement.value = "";
    }
  }

  clientRecipientOnKey(event) {
    console.log('clientRecipientOnKey event');
      this.selectedRecipientInput.nativeElement.value = "";
  }

  recipientClientsfocusOut() {
    console.log('recipientClientsfocusOut event');
    this.selectedRecipientInput.nativeElement.value = "";
  }

  removeClientRecipient(c: ESignClient): void {
    console.log('remove client recipient');
    const index = this.selectedRecipientClients.indexOf(c);
    if (index >= 0) {
      this.selectedRecipientClients.splice(index, 1);
    }
    this.recipientClients = <ESignClient[]>this.cacheClients;
  }

  addCopyCpa(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    if ((value && event.isUserInput)) {
      let c: ESignCPA = null;
      let ec: ESignCPA = null;
      this.copyCpas.forEach(cc => { if (cc.cpaId === value) { c = cc; } });
      this.selectedCopyCpas.forEach(cc => { if (cc.cpaId === c.cpaId) { ec = cc; } });
      if (!ec) {
        this.selectedCopyCpas.push(c);
      }
    }
    console.log(this.searchCPA);
    this.searchCPA = '';
  }

  removeCopyCpa(c: ESignCPA): void {
    const index = this.selectedCopyCpas.indexOf(c);
    if (index >= 0) {
      this.selectedCopyCpas.splice(index, 1);
    }
    this.copyCpas = <ESignCPA[]>this.cacheCpas;
  }

  copyCpasfocusOut() {
    console.log('copyCpasfocusOut event');
    this.selectedCopyCpasInput.nativeElement.value = "";
  }

  copyCpasOnKey($event) {
    console.log('copyCpasOnKey event');
    this.selectedCopyCpasInput.nativeElement.value = "";
  }

  setInitCase(caseheader: ESignCase, caseType: string) {
    console.log('set init case', caseheader);
    console.log('case type:', caseType);
    this.initcaseheader = caseheader;
    this.caseType = caseType;
  }

  setcaseHeader(caseheader: ESignCase) {
    this.caseStep1Form.controls['category'].setValue(null);
    this.primarysigner = caseheader.primarySigner;
    if (this.primarysigner) {
      this.caseStep1Form.controls['primarySignerControl'].setValue(this.primarysigner.clientId);
    }
    this.secondarysigner = caseheader.secondarySigner;
    if (this.secondarysigner) {
      this.caseStep1Form.controls['primarySignerControl'].setValue(this.secondarysigner.clientId);
    }
    if (caseheader.recipientClients) {
      this.selectedRecipientClients = caseheader.recipientClients;
    } else {
      this.selectedRecipientClients = [];
    }
    if (caseheader.copyCpas) {
      this.selectedCopyCpas = caseheader.copyCpas;
    } else {
      this.selectedCopyCpas = [];
    }
    if (caseheader.cate) {
      this.caseStep1Form.controls['category'].setValue(caseheader.cate.id)
      // here we need to populate the subcate first
      this.casecates.forEach(ele => {
        if (ele.id === this.caseStep1Form.controls['category'].value) {
          this.subcates = ele.subCates;
          if (caseheader.subCate) {
            this.caseStep1Form.controls['subcategory'].setValue(caseheader.subCate.id);
          }
        }
      });
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
  }

  captureCaseJson(): any {
    const clients: ESignClient[] = [];
    this.selectedRecipientClients.forEach(ele => { clients.push(ele); });
    const cpas: ESignCPA[] = [];
    this.selectedCopyCpas.forEach(ele => { cpas.push(ele); });
    let cpa: ESignCPA = null;
    this.cacheCpas.forEach(ele => { if (ele.cpaId === this.service.auth.getUserID()) { cpa = ele; } });
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

    if (!this.primarysigner || typeof this.primarysigner === "undefined") {
      this.snackBar.open("Please select valid primary signer", '', { duration: 3000 });
      return;
    }

    if (this.primarysigner && this.primarysigner.isIdentityAnswerSet === 'N') {
      this.snackBar.open("Please set answers to primary signer's identity verification questions", '', { duration: 3000 });
      return;
    }

    if (this.secondarysigner && this.secondarysigner.isIdentityAnswerSet === 'N') {
      this.snackBar.open("Please set answers to secondary signer's identity verification questions", '', { duration: 3000 });
      return;
    }
    this.showSavespinner = true;
    const casejson = this.captureCaseJson();
    console.log(casejson);
    this.service.saveCase(casejson).subscribe(resp => {
      //  console.log(resp);
      const rr = <ESignCase>resp;
      console.log('save case');
      console.log(rr);
      this.caseType = "updatecase";
      this.service.mergeCaseHeader(rr);
      this.uiservice.setStepper(1);
      this.showSavespinner = false;
    });
  }

  updateCase() {
    if (!this.primarysigner || typeof this.primarysigner === "undefined") {
      this.snackBar.open("Please select valid primary signer", '', { duration: 3000 });
    } else {
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
  }

  setClientIdentityAnswer(clientId: string, clientType: string, ansId: string) {
    console.log('set client Identity' + clientId + ' ansId:' + ansId);
    const dialogRef = this.dialog.open(SetClientAnswerComponent, {
      width: '1460px'
    });
    dialogRef.componentInstance.setSource('newCase', clientId, clientType);
    dialogRef.componentInstance.step1panelref = this;
  }

  enterKeyDown() {
    this.enterKeyPress.emit();
  }
}

