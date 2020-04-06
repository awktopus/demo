import { Component, HostBinding, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { routerAnimation } from '../../utils/page.animation';
import { AuthService } from '../../core/auth/auth.service';
import { OUService } from '../../core/services/ou.service';
import { EsignStateSelector} from '../../esign/service/esign.state.selector'
import { UserService } from '../../core/services/user.service';
import { User2faSettingsDto } from '../../core/model/user2faSettings.dto';
import { pocolog } from 'pocolog';
import { AbstractStateSelector } from '../../core/states/abstract.state.selector';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  animations: [routerAnimation]
})
export class LoginPageComponent implements OnInit {
  // Add router animation
  @HostBinding('@routerAnimation') routerAnimation = true;
  email: string;
  password: string;
  showError: boolean;
  errorMsg: string;
  showSuccess: boolean;
  successMsg: string;
  showLoading: boolean;

  // 2fa variables
  login2faType: Login2faType = Login2faType.None;
  email2fa: string;
  phone2fa: string;
  sentTo: string;
  code: string;

  // 2fa flags
  hasEmail2fa = false;
  hasPhone2fa = false;
  show2faVerifyWindow = false;
  showEnter2faCode = false;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private auth: AuthService, private ouService: OUService,
    private stateselector: AbstractStateSelector, private userService: UserService) { }
  ngOnInit() {
    this.email = '';
    this.password = '';

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let status: string = params.status;
      if (status === 'resetSuccess') {
        this.showSuccess = true;
        this.successMsg = 'Password successfully reset. Login with your new password';
      } else if (status === 'verify') {

        this.show2faVerifyWindow = true;
        this.showEnter2faCode = true;
        this.sentTo = this.stateselector.getAuthData().userName;
      } else if (status === 'timeout') {
        this.showError = true;
        this.errorMsg = 'You have been logged out due to inactivity. Please login again.';
      } else if (status === 'expired') {
        this.showError = true;
        this.errorMsg = 'Your token has expired. Please re-request a new token.';
      }
    });
  }

  /**
   * Login method
   */
  login(event) {
    this.showLoading = true;
    this.showError = false;
    this.showSuccess = false;
    this.successMsg = '';
    this.errorMsg = '';
    event.preventDefault();
    this.auth.login(this.email, this.password)
      .then(res => {
        if (res && res.success) {
          if (!res.emailVerified) {
            pocolog.trace('email not verified');
            this.showLoading = false;

            // show verify UI
            this.show2faVerifyWindow = true;
            this.showEnter2faCode = true;
            this.sentTo = this.email;
          } else {
            if (res.twoFactorEnabled) {
              // 2fa login
              pocolog.trace('2fa detected');
              this.showLoading = false;
              let user2faSettings: User2faSettingsDto = res.user2faSettings;
              this.show2faVerifyWindow = true;
              this.hasEmail2fa = user2faSettings.emailConfirmed;
              this.hasPhone2fa = user2faSettings.phoneNumberConfirmed;
              this.email2fa = user2faSettings.email;
              this.phone2fa = user2faSettings.phoneNumber;

              if (this.hasEmail2fa && !this.hasPhone2fa) {
                // only 1 channel detected, auto select email
                this.request2FAEmail();
              }

            } else {
              this.initLoginDetails();
            }
          }
        } else {
          this.showLoading = false;
          this.showError = true;
          this.errorMsg = res.error;
        }
      })
      .catch(error => {
        this.showLoading = false;
        this.showError = true;
        pocolog.error(error);
        this.errorMsg = error;
      });
  }

  initLoginDetails() {
    // init login details
    return this.userService.initLoginDetails().then(loginRes => {
      this.showLoading = false;
      if (loginRes) {
        this.router.navigateByUrl('/main');
      } else {
        this.showError = true;
        this.errorMsg = 'Service unavailable. Please try again later';
        this.auth.logout();
      }
    })
      .catch(error => {
        this.showLoading = false;
        this.showError = true;
        pocolog.error(error);
        this.errorMsg = 'Error contacting login service. Please try again';
      });
  }

  request2FAEmail() {
    this.showEnter2faCode = true;
    this.sentTo = this.email2fa;
    this.login2faType = Login2faType.Email;
    this.auth.get2FAEmail().then(res => {
    });
  }
  request2FAPhone() {
    this.showEnter2faCode = true;
    this.sentTo = this.phone2fa;
    this.login2faType = Login2faType.Sms;
    this.auth.get2FASms().then(res => {
    });
  }

  requestNewCode() {
    this.showError = false;
    this.showSuccess = false;
    if (this.login2faType === Login2faType.Email) {
      this.auth.get2FAEmail().then(res => {
        if (res.success === false) {
          this.showError = true;
          this.errorMsg = res.error;
        } else {
          this.showSuccess = true;
          this.successMsg = "Code resent successful!";
        }
      });
    } else if (this.login2faType === Login2faType.Sms) {
      this.auth.get2FASms().then(res => {
        if (res.success === false) {
          this.showError = true;
          this.errorMsg = res.error;
        } else {
          this.showSuccess = true;
          this.successMsg = "Code resent successful!";
        }
      });
    } else if (this.login2faType === Login2faType.None) {
      // send verify email
      this.auth.sendAccountVerificationEmail(this.email).then(res => {
        this.showSuccess = true;
        this.successMsg = "Code resent successful!";
      }).catch(err => {
        this.showError = true;
        this.errorMsg = err.statusText;
      });
    }
  }

  verify(event) {
    this.showLoading = true;
    this.showError = false;
    this.showSuccess = false;

    if (this.login2faType === Login2faType.Email) {
      this.auth.verify2FAEmail(this.code).then(res => {
        if (res && res.success) {
          this.initLoginDetails();
        } else {
          this.showLoading = false;
          if (!res.error) {
            res.error = 'Unexpected error occured';
          }
          this.showError = true;
          this.errorMsg = res.error;
        }
      });
    } else if (this.login2faType === Login2faType.Sms) {

      this.auth.verify2FAPhone(this.code).then(res => {
        if (res && res.success) {
          this.initLoginDetails();
        } else {
          this.showLoading = false;
          if (!res.error) {
            res.error = 'Unexpected error occured';
          }
          this.showError = true;
          this.errorMsg = res.error;
        }
      });
    } else if (this.login2faType === Login2faType.None) {

      this.auth.exchangeTo2FAJWT().then(jwt => {
        if (jwt && jwt.success) {
          let jwtToken = jwt.auth.accessToken;
          this.auth.verify2FAEmailWithJWTToken(this.code, jwtToken).then(res => {
            if (res && res.success) {
              this.initLoginDetails();
            } else {
              this.showLoading = false;
              if (!res.error) {
                res.error = 'Unexpected error occured';
              }
              this.showError = true;
              this.errorMsg = res.error;
            }
          });
        }

      });
    }
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.login(event);
    }
  }
}

export enum Login2faType {
  None = 0,
  Sms = 1,
  Email = 2
}
