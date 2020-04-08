import { Injectable } from '@angular/core';
import { BehaviorSubject , Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  ESignUI } from '../beans/ESignCase';
import { EsignAuthService } from './esignauth.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class EsignuiserviceService {
public baseurl = environment.apiEsignLink;
// CPAID = 'CPA006';
  v_clientvalue: string;
  // this the general UI controls for ESignCase
  private _esignui: BehaviorSubject<ESignUI> = new BehaviorSubject(new ESignUI());
  public readonly cur_ui: Observable<ESignUI> = this._esignui.asObservable();
  constructor(private http: HttpClient, public auth: EsignAuthService) { }

  searchClientContacts(cpaID: string, newVar: string) {
    const tk = newVar.trim();
    // http://localhost:55940/api/clients/OrgUnitId/<OrgUnitId>/staff/<StaffId>/client/<SearchToken>
    const url = this.baseurl + '/clients/OrgUnitId/' + this.auth.getOrgUnitID() + '/staff/'
      + this.auth.getUserID() + '/client/' + tk;
    return this.http.get(url, this.auth.getESignOptions());
  }

  searchCPAContacts(cpaID: string, newVar: string) {
    // http://localhost:55940/api/CPAs/orgunitid/<OrgUnitId>/staff/<SearchToken>
    const tk = newVar.trim();
    const url = this.baseurl + '/CPAs/orgunitid/' + this.auth.getOrgUnitID() + '/staff/' + tk;
    return this.http.get(url, this.auth.getESignOptions());
  }

  searchFormcodes(newval: string) {
    const url = this.baseurl + '/Configs/FormCodes/' + newval.trim();
    return this.http.get(url, this.auth.getESignOptions());
  }

  setStepper(istep: number) {
    console.log('setting stepper' + istep);
    if (istep === 0) {
      const ui: ESignUI = new ESignUI();
      console.log(ui);
      ui.stepperIndex = istep;
      this._esignui.next(ui);
    } else {
    const ui: ESignUI = this._esignui.getValue();
    console.log(ui);
    ui.stepperIndex = istep;
    this._esignui.next(ui);
  }
  }

  searchCaseUsers(searchkey: string) {
    const cpaId = this.auth.getUserID();
    const url = this.baseurl + '/Cases/' + cpaId + '/' + searchkey;
    return this.http.get(url, this.auth.getESignOptions());
  }

  searchOrgClientContacts(orgUnitId: string, newVar: string) {
    const tk = newVar.trim();
    console.log('tk:' + tk);
    const url = this.baseurl + '/clients/OrgUnitId/' + this.auth.getOrgUnitID() + '/client/' + tk;
    return this.http.get(url, this.auth.getESignOptions());
  }

  getDistinctTaxYears() {
    const url = this.baseurl + '/configs/taxyears';
    return this.http.get(url, this.auth.getESignOptions());
  }

}
