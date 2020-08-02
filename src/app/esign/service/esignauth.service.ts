// this service handle Esign service security etc
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractStateSelector } from "../../core/states/abstract.state.selector";
import { environment } from '../../../environments/environment';
import { EsignStateSelector } from './esign.state.selector';
import { PubSub } from '../../core/services/pubsub.service';
import { EsignLocalStateSelector } from './esign.localstate.selector';

// import { EventEmitter } from '@angular/core';
@Injectable()
export class EsignAuthService {
  public baseurl = environment.apiEsignLink;
  KEY_ELTOKEN = 'ELACCESSTOKEN';
  KEY_ESign = 'ESIGNTT';
  USER_OU_NAME = 'UserOUName';
  private _org: BehaviorSubject<any> = new BehaviorSubject((null));
  public readonly cur_org: Observable<any> = this._org.asObservable();

  // 040420 - Menu PubSub refactoring - start
  selected_org: any;
  onOrgSwitchedSub: any;
  industryId: string;
  TAX_MENU = "tax_menu";
  TAX_CASE_MENU = "tax_case_menu";
  TAX_SETTINGS_MENU = "tax_settings_menu";
  TAX_MY_TAX_CASE = "tax_my_tax_case";
  IET_MENU = "iet_menu";
  TAX_ARCHIVE_MENU = "tax_archive_menu";
  MENU_ITEM_EZSIGN = "ezsign_menu";
  HEALTH_CHECK_MENU = "health_check_menu";
  enabledMenus: string[] = [];
  // 040420 - Menu PubSub refactoring - end

  constructor(private http: HttpClient, private esignstate: AbstractStateSelector,
    private pubSub: PubSub, private esignlocalstate: EsignLocalStateSelector) {
    console.log('esign auth service constructor');
    this.pubSubForELToolsMenuSecurity();
  }

  pubSubForELToolsMenuSecurity() {
    // 040420 - Menu PubSub refactoring - start
    console.log('pubSubForELToolsMenuSecurity - start');
    this.onOrgSwitchedSub = this.pubSub.subscribe(PubSub.ON_ORG_SWITCHED,
      data => {
        this.enabledMenus = [];
        this.selected_org = data
        console.log('Inside pubSubForELToolsMenuSecurity selected org:');
        console.log(this.selected_org);
        if (this.selected_org) {
          this.industryId = this.selected_org.industryId;
          let currentOrgUser = this.esignstate.getCurrentOrgUser();
          if (currentOrgUser) {
            if (this.industryId.toUpperCase() === 'ACCOUNT'
              && currentOrgUser.role.toUpperCase() !== 'PARTNER'
              && this.industryId.toUpperCase() !== 'PERSONAL'
              && currentOrgUser.role.toUpperCase() !== 'CLIENT') {
              this.enabledMenus.push(this.TAX_MENU);
              this.enabledMenus.push(this.TAX_CASE_MENU);
              this.enabledMenus.push(this.TAX_ARCHIVE_MENU);
            }
            if (this.industryId.toUpperCase() !== 'PERSONAL') {
              this.enabledMenus.push(this.IET_MENU);
              this.enabledMenus.push(this.MENU_ITEM_EZSIGN);
              this.enabledMenus.push(this.HEALTH_CHECK_MENU);
            }
            if (currentOrgUser.role.toUpperCase() === 'CLIENT') {
              this.enabledMenus.push(this.TAX_MENU);
              this.enabledMenus.push(this.TAX_MY_TAX_CASE);
            }
            if (currentOrgUser.role.toUpperCase() === 'ADMIN' ||
              currentOrgUser.role.toUpperCase() === 'OWNER') {
              this.enabledMenus.push(this.TAX_SETTINGS_MENU);
            }
          } else {
            console.log('Current organization user object is null, hence not able enable menu items')
          }
          this.pubSub.next<string[]>(PubSub.MENU_ENABLED, this.enabledMenus);
        }
        console.log('pubSubForELToolsMenuSecurity - end');
      });
    // 040420 - Menu PubSub refactoring - end
  }

  clearEsignCache() {
    // localStorage.removeItem(this.KEY_ESign);
    this.esignlocalstate.clearData();
  }
  isEsignAuth(): boolean {
    // const auth = localStorage.getItem(this.esign_key);
    if (this.getESignToken()) { return true; } else { return false; }
  }

  updateOrg(newOrg: any) {
    console.log('current Org');
    console.log(newOrg);
    console.log('<<<<');
    // localStorage.setItem(this.USER_OU_NAME, newOrg.name);
    console.log('get UserOUName:');
    // console.log(localStorage.getItem(this.USER_OU_NAME));
    this._org.next(newOrg);
    if (this.esignstate instanceof EsignStateSelector) {
      console.log()
      this.esignstate.setOrgData(newOrg);
    }
    console.log('get auth data:' + this.esignstate.getAuthData());
  }

  getESignToken(): string {
    // return JSON.parse(localStorage.getItem(this.esign_key));
    // const v = localStorage.getItem(this.KEY_ESign);
    const v = this.esignlocalstate.getESignAccessToken();
    if (v) {
      return v.accessToken;
    } else {
      return null;
    }
  }
  getOrgUnitName(): string {
    // const v = localStorage.getItem(this.USER_OU_NAME);
    const v = this.esignstate.getCurrentOrg();
    if (v) {
      return v.name;
    } else {
      return null;
    }
  }
  setESignToken(token: string) {
    // console.log('setting esign token:', token);
    // localStorage.setItem(this.esign_key, JSON.stringify(token));
    // this.esignauth = token;
    // localStorage.setItem(this.KEY_ESign, token);
    this.esignlocalstate.setESignAccessToken(token);
  }

  runESignAuth() {
    const url = this.baseurl + '/EsignAuth/';
    // console.log(this.getELOptions());
    console.log('get auth data');
    console.log(this.esignstate.getAuthData());
    return this.http.post(url, { 'ElAccessToken': this.esignstate.getAuthData().accessToken }, this.getELOptions());
  }
  getELOptions() {
    const token = this.esignstate.getAuthData();
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + token.accessToken);
    console.log(header);
    return { 'headers': header };
  }

  getOrgUnitID(): string {
    return this.esignstate.getCurrentOrg().id;
  }
  getUserID(): string {
    return this.esignstate.getCurrentUser().userId;
  }
  getUserFirstName(): string {
    return this.esignstate.getCurrentUser().firstName;
  }

  getUserLastName(): string {
    return this.esignstate.getCurrentUser().lastName;
  }

  getUserEmail(): string {
    return this.esignstate.getCurrentUser().email;
  }
  getUserRole(): string {
  //  console.log('get user role inside esign auth');
  //  console.log(this.esignstate.getCurrentOrgUser());
    if (this.esignstate.getCurrentOrgUser()) {
      return this.esignstate.getCurrentOrgUser().role;
    }
  }

  getESignOptions() {
    const token: any = this.getESignToken();
    // console.log( token);
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + token);
    // console.log('el token:' + this.elstore.getAuth().accessToken);
    header = header.append('ElToken', this.esignstate.getAuthData().accessToken);
    // console.log(header);
    // console.log('step 2.2');
    return { 'headers': header };
  }

  getESignOptionswithoutElToken() {
    const token: any = this.getESignToken();
    // console.log( token.esignAccessToken );
    let header = new HttpHeaders();
    header = header.append('Authorization', 'Bearer ' + token);
    // console.log(header);
    return { 'headers': header };
  }

  getEZSignOptions() {
    const token: any = this.getESignToken();
    let header = new HttpHeaders();
    header = header.append('Authorization', 'Bearer ' + token);
    header = header.append('ElToken', this.esignstate.getAuthData().accessToken);
    return { 'headers': header };
  }

}
