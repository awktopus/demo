// this service handle Esign service security etc
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';



// import { EventEmitter } from '@angular/core';
@Injectable()
export class GuestEZsignAuthService {
  public baseurl = environment.apiEsignLink;

  private _guestezsigntoken: any = null;
  private _guesttoken: any = null;
  constructor(private http: HttpClient) {

  }

  getGuestToken(): any {
    return this._guesttoken;
  }

  setGuestToken(token: any) {
    this._guesttoken = token;
  }

  clearEzsignGuestAuthToken() {
    // localStorage.removeItem(this.KEY_ESign);
      this._guestezsigntoken = null;
  }

  getEzsignGuestAuthToken() {
      return this._guestezsigntoken;
  }

  isGuestEzsignAuth(): boolean {
    // const auth = localStorage.getItem(this.esign_key);
    if (this.getEzsignGuestAuthToken()) { return true; } else { return false; }
  }
  setEzsignGuestAuthToken(token: string) {
    this._guestezsigntoken = token;
  }

  runGuestEzsignAuth(guestToken: any) {
    const url = this.baseurl + '/guestezsign/token/validate';
    // console.log(this.getELOptions());
    console.log('get auth data');
    return this.http.post(url, { 'token': guestToken});
  }
  getGuestEzsignOptions() {
    const token = this.getEzsignGuestAuthToken();
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + token.accessToken);
    console.log(header);
    return { 'headers': header };
  }


  getGuestEzsignNoContentOptions() {
    const token: any = this.getEzsignGuestAuthToken();
    let header = new HttpHeaders();
    header = header.append('Authorization', 'Bearer ' + token);
    return { 'headers': header };
  }

}
