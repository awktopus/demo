// this service handle Esign service security etc
import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../core/localStorage/local-storage.service';
import { environment } from '../../../environments/environment';

// import { EventEmitter } from '@angular/core';
@Injectable()
export class EsignAuthService {
  public baseurl = environment.apiEsignLink;
  KEY_ELTOKEN = 'ELACCESSTOKEN';
  KEY_ESign = 'ESIGNTT';
  USER_OU_NAME = 'UserOUName';
  private _org: BehaviorSubject<any> = new BehaviorSubject((null));
  public readonly cur_org: Observable<any> = this._org.asObservable();
  constructor(private http: HttpClient, private elstore: LocalStorageService) {
 }

  clearEsignCache() {
    localStorage.removeItem(this.KEY_ESign);
  }
  isEsignAuth(): boolean {
    // const auth = localStorage.getItem(this.esign_key);
    if (this.getESignToken()) { return true; } else { return false; }
  }
  updateOrg(newOrg: any) {
    console.log('current Org');
    console.log(newOrg);
    console.log('<<<<');
    localStorage.setItem(this.USER_OU_NAME, newOrg.name);
    console.log('get UserOUName:');
    console.log(localStorage.getItem(this.USER_OU_NAME));
    this._org.next(newOrg);
  }
  getESignToken(): string {
    // return JSON.parse(localStorage.getItem(this.esign_key));
    const v = localStorage.getItem(this.KEY_ESign);
    if (v) {
      return v;
    } else {
      return null;
    }
  }
  getOrgUnitName(): string {
    const v = localStorage.getItem(this.USER_OU_NAME);
    if (v) {
      return v;
    } else {
      return null;
    }
  }
  setESignToken(token: string) {
    console.log('setting esign token:', token);
    // localStorage.setItem(this.esign_key, JSON.stringify(token));
    // this.esignauth = token;
    localStorage.setItem(this.KEY_ESign, token);
  }
  runESignAuth() {
    const url = this.baseurl + '/EsignAuth/';
    // console.log(this.getELOptions());
    return this.http.post(url, { 'ElAccessToken': this.elstore.getAuth().accessToken }, this.getELOptions());
  }
  getELOptions() {
    const token = this.elstore.getAuth();
    console.log('the token is:', token.accessToken);
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + token.accessToken);
    console.log(header);
    return { 'headers': header };
  }

  getOrgUnitID(): string {
    return this.elstore.getCurrentOU();
  }
  getUserID(): string {
    return this.elstore.getAuth().id;
  }

  getESignOptions() {
    const token: any = this.getESignToken();
    // console.log( token);
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + token);
    // console.log('el token:' + this.elstore.getAuth().accessToken);
    header = header.append('ElToken', this.elstore.getAuth().accessToken);
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
}
