import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { RegistrationDto } from './registration.dto';
import { EsignAuthService } from '../../esign/service/esignauth.service';
import { EsignStateSelector} from '../../esign/service/esign.state.selector';
import { environment } from '../../../environments/environment';
import { pocolog } from 'pocolog';

@Injectable()
export class AuthService {

  AUTH_TYPE_2FA = "2fa-auth";
  AUTH_TYPE_DEFAULT = "default-auth";
  EL_PLC = 'https://www.everleagues.com/jwt/claims/plc'; // el policy
  EL_2FA = 'https://www.everleagues.com/jwt/claims/2fa'; // 2fa enabled
  EL_EMV = 'https://www.everleagues.com/jwt/claims/emv'; // email verifiedmm
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  constructor(private api: ApiService, private stateselector: EsignStateSelector, private esignauth: EsignAuthService) { }

  isAuthenticated(): boolean {
    const auth = this.stateselector.getAuthData();
    // check for token type
    if (auth) {
      let tokenDecode = this.parseJwt(auth.accessToken);
      if (tokenDecode && tokenDecode[this.EL_PLC]) {
        let authType = tokenDecode[this.EL_PLC];

        if (authType === this.AUTH_TYPE_DEFAULT) {
          return true;
        } else {
          console.log('AuthType ' + authType + ' detected.');
        }
      }
    }
    return false;
  }

  isVerified(): boolean {
    console.log('inside auth service');
    console.log(this.stateselector);
    const auth = this.stateselector.getAuthData();
    console.log(auth);
    if (auth) {
      let tokenDecode = this.parseJwt(auth.accessToken);
      if (tokenDecode && tokenDecode[this.EL_EMV]) {
        let isEmailVerified = this.stringToBoolean(tokenDecode[this.EL_EMV]);

        if (isEmailVerified) {
          return true;
        } else {
          console.log('Email not verified');
        }
      }
    }
    return false;
  }

  private stringToBoolean(str) {
    if (str) {
      if (typeof str === "boolean") {
        return str
      }
      switch (str.toLowerCase().trim()) {
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(str);
      }
    }
    return false;
  }

  parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  };

  login(email: string, password: string): Promise<any> {
    return this.api.postAsync<any>('v2/auth', { username: email, password: password })
      .then(data => {
        let token = this.parseJwt(data.accessToken);
        if (token) {
          if (!this.stringToBoolean(token[this.EL_EMV])) {
            return Promise.resolve({
              success: true, error: null, errorCode: null, emailVerified: false
            });
          } else {

            if (token[this.EL_2FA]) {
              // this.localStorage.clear();
              this.stateselector.setAuthData(data);
              this.esignauth.clearEsignCache();
              // call 2fa settings to check for 2fa channel type
              return this.get2FASettings().then(res => {

                return Promise.resolve({
                  success: true, error: null, errorCode: null, twoFactorEnabled: data.twoFactorEnabled,
                  emailVerified: data.emailVerified, user2faSettings: res
                });
              });
            } else {
              return this.successLogin(data);
            }
          }
        } else {
          this.api.handleError(data);
          return Promise.resolve({
            success: false, error: data.error.error, errorCode: data.error.code
          });
        }
      }).catch((res: any) => {
        this.api.handleError(res);
        pocolog.error(res);
        return Promise.resolve({ success: false, error: res.error.error, errorCode: res.error.code });
      });
  }

  logout(): void {
   // this.localStorage.clear();
  }

  passcodeCheck(email: string, code: string) {
    return this.api.postAsync<any>('account/passcode/verify', { email: email, code: code })
      .then(res => {
        return Promise.resolve(res);
      }).catch((res: any) => {
        let error = this.api.handleError(res);
        return Promise.resolve({ success: false, error: error, errorCode: res.error.errorCode });
      });
  }

  getPermission(ouId: string) {
    return this.api.getAysnc<any>('auth/permission/' + ouId)
      .then(res => {
        return Promise.resolve(res);
      }).catch((res: any) => {
        let error = this.api.handleError(res);
        return Promise.reject({ success: false, error: error, errorCode: res.error.errorCode });
      });
  }


  get2FASettings() {
    return this.api.getAysnc<any>('v2/auth/2fa/settings', null, this.stateselector.getCurrentUser().userId)
      .then(res => {
        return Promise.resolve(res);
      }).catch((res: any) => {
        console.log(res);
        this.api.handleError(res);
        return Promise.resolve({ success: false, error: res.statusText, errorCode: res.status });
      });
  }

  get2FASms() {
    return this.api.getAysnc<any>('v2/auth/2fa/sms', null, this.stateselector.getCurrentUser().userId)
      .then(res => {
        return Promise.resolve(res);
      }).catch((res: any) => {
        console.log(res);
        let error = this.api.handleError(res);
        return Promise.resolve({ success: false, error: error, errorCode: res.status });
      });
  }

  send2FASms(phone: string) {
    return this.api.postAsync<any>('v2/auth/2fa/sms', JSON.stringify(phone), this.stateselector.getCurrentUser().userId)
      .then(res => {
        return this.successLogin(res);
      }).catch((res: any) => {

        let error = this.api.handleError(res);
        return Promise.resolve({ success: false, error: error, errorCode: res.status });
      });
  }

  get2FAEmail() {
    return this.api.getAysnc<any>('v2/auth/2fa/email', null, this.stateselector.getCurrentUser().userId)
      .then(res => {
        return Promise.resolve(res);
      }).catch((res: any) => {
        console.log(res);
        let error = this.api.handleError(res);
        return Promise.resolve({ success: false, error: error, errorCode: res.status });
      });
  }

  verify2FAEmail(code: string) {
    return this.api.postAsync<any>('v2/auth/2fa/email/verify', JSON.stringify(code), this.stateselector.getCurrentUser().userId)
      .then(res => {
        return this.successLogin(res);
      }).catch((res: any) => {
        let error = this.api.handleError(res);
        return Promise.resolve({ success: false, error: error, errorCode: res.status, auth: null });
      });
  }

  verify2FAPhone(code: string) {
    return this.api.postAsync<any>('v2/auth/2fa/sms/verify', JSON.stringify(code), this.stateselector.getCurrentUser().userId)
      .then(res => {
        return this.successLogin(res);
      }).catch((res: any) => {
        let error = this.api.handleError(res);
        return Promise.resolve({ success: false, error: error, errorCode: res.status, auth: null });
      });
  }

  sendAccountVerificationEmail(email) {
    return this.api.postAsync<any>('v2/auth/2fa/signup/email', JSON.stringify(email), this.stateselector.getCurrentUser().userId)
      .then(res => {
        return Promise.resolve(res);
      }).catch((res: any) => {
        this.api.handleError(res);
        return Promise.reject(res);
      });
  }

  send2FASmsWithJWTToken(phone: string, jwtToken) {
    return this.api.postAsyncWithJwtToken<any>('v2/auth/2fa/sms', jwtToken, JSON.stringify(phone),
     this.stateselector.getCurrentUser().userId)
      .then(res => {
        return this.successLogin(res);
      }).catch((res: any) => {
        let error = this.api.handleError(res);
        return Promise.resolve({ success: false, error: error, errorCode: res.status });
      });
  }

  verify2FAPhoneWithJWTToken(code: string, jwtToken: string) {
    return this.api.postAsyncWithJwtToken<any>('v2/auth/2fa/sms/verify', jwtToken, JSON.stringify(code), 
    this.stateselector.getCurrentUser().userId)
      .then(res => {
        return this.successLogin(res, false);
      }).catch((res: any) => {
        let error = this.api.handleError(res);
        return Promise.resolve({ success: false, error: error, errorCode: res.status, auth: null });
      });
  }

  verify2FAEmailWithJWTToken(code: string, jwtToken: string) {
    return this.api.postAsyncWithJwtToken<any>('v2/auth/2fa/email/verify', jwtToken, JSON.stringify(code),
    this.stateselector.getCurrentUser().userId)
      .then(res => {
        return this.successLogin(res, false);
      }).catch((res: any) => {
        let error = this.api.handleError(res);
        return Promise.resolve({ success: false, error: error, errorCode: res.status, auth: null });
      });
  }


  exchangeTo2FAJWT() {
    return this.api.postAsync<any>('v2/auth/2fa/exchange', null, this.stateselector.getCurrentUser().userId)
      .then(res => {
        console.log(res);
        return Promise.resolve({ success: true, error: null, errorCode: null, auth: res });
      }).catch((res: any) => {
        let error = this.api.handleError(res);
        return Promise.resolve({ success: false, error: error, errorCode: res.status, auth: null });
      });
  }

  register(data: RegistrationDto) {
    return this.api.postAsync<any>('account', data)
      .then(res => {
        // this.localStorage.setAuth(res);
        this.stateselector.setAuthData(res);
        return Promise.resolve(res);
      }).catch((res: any) => {
        this.api.handleError(res);
        return Promise.reject(res);
      });
  }


  successLogin(authData, clearCache = true): Promise<any> {
    if (clearCache) {
      // this.localStorage.clear();
      this.esignauth.clearEsignCache();
    }
    console.log("auth data:");
    console.log(authData);
   // this.localStorage.setAuth(authData);
    this.stateselector.setAuthData(authData);
    console.log(this.parseJwt(authData.accessToken));
    return Promise.resolve({
      success: true, error: null, errorCode: null, twoFactorEnabled: false,
      emailVerified: true
    });
  }

}
